/**
 * Middleware to restrict route access to authenticated sessions only.
 * Unauthenticated API requests receive a 401 response, while page requests redirect to login.html.
 */
function requireAuth(req, res, next) {
  if (req.session && req.session.isAuthenticated) {
    return next();
  }

  // Exempt login endpoints and login page itself to prevent circular redirect
  const isLoginPage = req.path === '/login.html';
  const isLoginApi = req.path.startsWith('/api/auth');
  const isStaticAsset = req.path.match(/\.(css|js|png|jpg|ico)$/); // Allow assets needed for login page

  if (isLoginPage || isLoginApi || isStaticAsset) {
    return next();
  }

  // API requests get a JSON error response
  if (req.path.startsWith('/api/')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized. Please log in.'
    });
  }

  // Frontend routes redirect to login
  res.redirect('/login.html');
}

module.exports = requireAuth;
