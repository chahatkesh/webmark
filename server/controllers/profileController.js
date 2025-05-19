import User from '../models/userModel.js';
import Bookmark from '../models/bookmarkModel.js';
import Category from '../models/categoryModel.js';
import crypto from 'crypto';

// Get unique device ID based on user agent and IP - without timestamp to prevent new device on refresh
const generateDeviceId = (userAgent, ip) => {
  // Add additional browser fingerprinting - extract browser and OS info
  const browserInfo = userAgent ? userAgent.split(' ').slice(0, 3).join(' ') : '';
  return crypto.createHash('md5').update(`${browserInfo}-${ip}`).digest('hex');
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

    const existingDevice = user.loginDevices.find(d => d.deviceId === deviceId);

    if (existingDevice) {
      existingDevice.lastActive = currentLogin;
      existingDevice.userAgent = userAgent;
      existingDevice.isActive = true;
    } else {
      user.loginDevices.push({
        deviceId,
        userAgent,
        lastActive: currentLogin,
        deviceName,
        isActive: true
      });
    }

    // Keep track of only the last 10 devices
    if (user.loginDevices.length > 10) {
      // Sort by last active and keep only the 10 most recent
      user.loginDevices.sort((a, b) => b.lastActive - a.lastActive);
      user.loginDevices = user.loginDevices.slice(0, 10);
    }

    await user.save();

    // Get active devices (active in the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeDevices = user.loginDevices
      .filter(device => device.isActive && device.lastActive > thirtyDaysAgo)
      .map(device => ({
        deviceId: device.deviceId,
        deviceName: device.deviceName,
        lastActive: device.lastActive,
        isCurrent: device.userAgent === userAgent
      }));

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
