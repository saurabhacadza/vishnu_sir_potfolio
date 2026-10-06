// Config for "The Thinking Student" newsletter feed.
// Folder: https://drive.google.com/drive/folders/1UfS2tM63PyRr4jPHEE-TPGiV7TlkSXEb
// The folder must stay shared as "Anyone with the link → Viewer".
// The API key is restricted to the Google Drive API only.
//
// The key is checked into the repo deliberately, so no environment variable is
// needed to deploy. An env var still wins if one is set, which is handy for
// rotating the key without a code change.

export const NEWSLETTER_FOLDER_ID =
  process.env.NEWSLETTER_FOLDER_ID ?? '1UfS2tM63PyRr4jPHEE-TPGiV7TlkSXEb'

export const DRIVE_API_KEY =
  process.env.DRIVE_API_KEY ?? 'AIzaSyCwd-lvlRtJWOny28lJAa0EGKQhVgn0m_o'
