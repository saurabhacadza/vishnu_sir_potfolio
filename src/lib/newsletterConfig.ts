// Config for "The Thinking Student" newsletter feed.
// Folder: https://drive.google.com/drive/folders/1UfS2tM63PyRr4jPHEE-TPGiV7TlkSXEb
// The folder must stay shared as "Anyone with the link → Viewer".
//
// The key previously lived in this file in plain text, which put it in a public
// repo. It now comes from the environment: DRIVE_API_KEY in .env.local locally,
// and an Amplify environment variable in production. Restrict the key to the
// Google Drive API in the Google Cloud console.

export const NEWSLETTER_FOLDER_ID =
  process.env.NEWSLETTER_FOLDER_ID ?? '1UfS2tM63PyRr4jPHEE-TPGiV7TlkSXEb'

export const DRIVE_API_KEY = process.env.DRIVE_API_KEY ?? ''
