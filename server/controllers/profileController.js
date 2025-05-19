import User from '../models/userModel.js';
import Bookmark from '../models/bookmarkModel.js';
import Category from '../models/categoryModel.js';
import crypto from 'crypto';

// Get unique device ID based on user agent and IP - without timestamp to prevent new device on refresh
const generateDeviceId = (userAgent, ip) => {
  // Extract stable parts of the user agent for consistent fingerprinting
  // Only use browser name, OS name, and device type for stable identification
  let stableFingerprint = '';

  if (userAgent) {
    // Extract browser name (Chrome, Firefox, Safari, etc.)
    const browserMatch = userAgent.match(/(Chrome|Firefox|Safari|Edge|MSIE|Trident)[\/\s](\d+)/i);
    const browserName = browserMatch ? browserMatch[1] : 'Unknown';

    // Extract OS (Windows, Mac, iOS, Android)
    const osMatch = userAgent.match(/(Windows|Mac|iPhone|iPad|iOS|Android|Linux)[;\s)]?/i);
    const osName = osMatch ? osMatch[1] : 'Unknown';

    // Device type (Mobile/Desktop)
    const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent);
    const deviceType = isMobile ? 'Mobile' : 'Desktop';

    stableFingerprint = `${browserName}-${osName}-${deviceType}`;
  }

  // Clean up IP to handle proxy variations (use only first part of the IP to avoid NAT issues)
  const cleanIp = ip ? ip.split(',')[0].trim().split('.').slice(0, 2).join('.') : 'unknown';

  return crypto.createHash('md5').update(`${stableFingerprint}-${cleanIp}`).digest('hex');
};

// Get device name from user agent
const getDeviceName = (userAgent) => {
  if (!userAgent) return 'Unknown device';

  const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent);
  const isTablet = /Tablet|iPad/i.test(userAgent);
  const isMac = /Macintosh|Mac OS X/i.test(userAgent) && !isMobile;
  const isWindows = /Windows/i.test(userAgent);
  const isLinux = /Linux/i.test(userAgent) && !isMobile;
  const isSafari = /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent);
  const isChrome = /Chrome/i.test(userAgent);
  const isFirefox = /Firefox/i.test(userAgent);
  const isEdge = /Edg/i.test(userAgent);

  let deviceType = 'Unknown device';
  if (isMobile && !isTablet) deviceType = 'Mobile';
  else if (isTablet) deviceType = 'Tablet';
  else if (isMac) deviceType = 'Mac';
  else if (isWindows) deviceType = 'Windows';
  else if (isLinux) deviceType = 'Linux';

  let browser = '';
  if (isEdge) browser = ' (Edge)';
  else if (isChrome) browser = ' (Chrome)';
  else if (isSafari) browser = ' (Safari)';
  else if (isFirefox) browser = ' (Firefox)';

  return `${deviceType}${browser}`;
};

// Get detailed profile information for the user
export const getProfileInfo = async (req, res) => {
  try {
    const userId = req.body.userId;

    // Get user data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Get all categories for this user
    const categories = await Category.find({ userId });
    const categoryIds = categories.map(category => category._id);

    // Get counts in parallel
    const [bookmarkCount, categoryCount] = await Promise.all([
      Bookmark.countDocuments({ categoryId: { $in: categoryIds } }),
      categories.length
    ]);

    // Extract user agent from request for device information
    const userAgent = req.headers['user-agent'];
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Check for existing device-id in cookie or headers
    const deviceId = req.headers['device-id'] || generateDeviceId(userAgent, ip);

    // Set device-id header in response to enable client-side storage
    res.set('X-Device-ID', deviceId);

    const deviceName = getDeviceName(userAgent);

    // Create a timestamp for the current login
    const currentLogin = new Date();

    // Update the user's last login time if it doesn't exist
    if (!user.lastLogin) {
      user.lastLogin = currentLogin;
      user.lastLoginDevice = userAgent;
    }

    // Update or add device to login devices
    if (!user.loginDevices) {
      user.loginDevices = [];
    }

    // First, check if we already have a device with this ID
    let existingDevice = user.loginDevices.find(d => d.deviceId === deviceId);

    // Second check: If we have a very similar device, merge them 
    // (handles case where fingerprinting is slightly different but it's the same device)
    if (!existingDevice) {
      const similarDevice = user.loginDevices.find(d => {
        // Consider similar if the device name matches and it was active recently (last 14 days)
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        return d.deviceName === deviceName && d.lastActive > twoWeeksAgo;
      });

      if (similarDevice) {
        // Update the similar device's ID to match the new one
        similarDevice.deviceId = deviceId;
        existingDevice = similarDevice;
        console.log(`Merged similar device: ${deviceName}`);
      }
    }

    if (existingDevice) {
      existingDevice.lastActive = currentLogin;
      existingDevice.userAgent = userAgent;
      existingDevice.isActive = true;
      // Update device name if it's more specific now
      if (deviceName !== 'Unknown device' && existingDevice.deviceName === 'Unknown device') {
        existingDevice.deviceName = deviceName;
      }
    } else {
      // This is genuinely a new device
      console.log(`New device detected: ${deviceName}`);
      user.loginDevices.push({
        deviceId,
        userAgent,
        lastActive: currentLogin,
        deviceName,
        isActive: true
      });
    }

    // Clean up potential duplicate devices
    // Group devices by name to identify duplicates
    const deviceGroups = {};
    user.loginDevices.forEach(device => {
      if (!deviceGroups[device.deviceName]) {
        deviceGroups[device.deviceName] = [];
      }
      deviceGroups[device.deviceName].push(device);
    });

    // For each group with multiple devices of the same name, keep only the most recently active one
    Object.keys(deviceGroups).forEach(name => {
      if (deviceGroups[name].length > 1) {
        // Sort by last active date (newest first)
        deviceGroups[name].sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive));

        // Keep the most recent device and mark others as inactive
        const mostRecent = deviceGroups[name][0];
        for (let i = 1; i < deviceGroups[name].length; i++) {
          deviceGroups[name][i].isActive = false;
        }
        console.log(`Cleaned up ${deviceGroups[name].length - 1} duplicate devices for ${name}`);
      }
    });

    // Remove inactive devices older than 60 days
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    user.loginDevices = user.loginDevices.filter(device =>
      device.isActive || new Date(device.lastActive) > sixtyDaysAgo
    );

    // Keep track of only the last 10 active devices
    if (user.loginDevices.length > 10) {
      // Sort by active status first, then by last active date
      user.loginDevices.sort((a, b) => {
        if (a.isActive !== b.isActive) return b.isActive ? 1 : -1;
        return new Date(b.lastActive) - new Date(a.lastActive);
      });
      user.loginDevices = user.loginDevices.slice(0, 10);
    }

    await user.save();

    // Get active devices (active in the last 30 days and marked as active)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Only consider a device as current if deviceId matches exactly
    // This prevents duplicate "current device" entries
    const activeDevices = user.loginDevices
      .filter(device => device.isActive && new Date(device.lastActive) > thirtyDaysAgo)
      .map(device => ({
        deviceId: device.deviceId,
        deviceName: device.deviceName,
        lastActive: device.lastActive,
        isCurrent: device.deviceId === deviceId
      }));

    // Ensure at least the current device is shown
    if (activeDevices.length === 0) {
      activeDevices.push({
        deviceId: deviceId,
        deviceName: deviceName,
        lastActive: currentLogin,
        isCurrent: true
      });
    } else if (!activeDevices.some(device => device.isCurrent)) {
      // If current device not in active devices, fix it
      const currentDeviceIndex = user.loginDevices.findIndex(d => d.deviceId === deviceId);
      if (currentDeviceIndex >= 0) {
        user.loginDevices[currentDeviceIndex].isActive = true;
        activeDevices.push({
          deviceId: deviceId,
          deviceName: deviceName,
          lastActive: currentLogin,
          isCurrent: true
        });
      }
    }

    const currentDeviceId = user.loginDevices.find(d => d.userAgent === userAgent)?.deviceId;

    res.json({
      success: true,
      profile: {
        username: user.username,
        email: user.email,
        name: user.name || '',
        profilePicture: user.profilePicture || '',
        joinedAt: user.joinedAt,
        lastLogin: user.lastLogin || currentLogin,
        lastLoginDevice: user.lastLoginDevice || userAgent,
        currentLoginDevice: userAgent,
        bookmarkCount,
        categoryCount,
        activeDevices,
        currentDeviceId,
        totalActiveDevices: activeDevices.length
      }
    });
  } catch (error) {
    console.error('Error fetching profile information:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching profile information"
    });
  }
};

// Update user profile information
export const updateProfile = async (req, res) => {
  try {
    const userId = req.body.userId;
    const { name, profilePicture } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Update allowed fields
    if (name !== undefined) user.name = name;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      profile: {
        username: user.username,
        email: user.email,
        name: user.name,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: "Error updating profile information"
    });
  }
};
