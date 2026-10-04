#!/usr/bin/env bash
# Exercises every S3-backed endpoint against a running dev server.
# Usage:  bash test-endpoints.sh [base-url]
BASE="${1:-http://localhost:3000}"

pass=0; fail=0
check() { # check <label> <actual> <expected>
  if [ "$2" = "$3" ]; then printf '  \033[32mPASS\033[0m %-46s %s\n' "$1" "$2"; pass=$((pass+1))
  else printf '  \033[31mFAIL\033[0m %-46s got %s want %s\n' "$1" "$2" "$3"; fail=$((fail+1)); fi
}
code() { curl -s -o /dev/null -w '%{http_code}' -m 25 "$1"; }

echo "Testing $BASE"
echo
echo "1. Newsletter listing"
body=$(curl -s -m 25 "$BASE/api/newsletters")
echo "   $body" | head -c 400; echo
check "GET /api/newsletters" "$(code "$BASE/api/newsletters")" "200"

# Pull the first key out of the listing so the next tests use a real object.
KEY=$(printf '%s' "$body" | sed -n 's/.*"id":"\([^"]*\)".*/\1/p' | head -1)
if [ -n "$KEY" ]; then
  echo "   first key: $KEY"
  ENC=$(printf '%s' "$KEY" | sed 's|/|%2F|g')
  echo
  echo "2. File + cover for that key"
  check "GET /api/newsletter-file (307 to S3)"  "$(code "$BASE/api/newsletter-file?key=$ENC")" "307"
  check "GET /api/newsletter-file?download=1"   "$(code "$BASE/api/newsletter-file?key=$ENC&download=1")" "307"
  check "GET /api/newsletter-thumb"             "$(code "$BASE/api/newsletter-thumb?key=$ENC")" "200"
else
  echo "   (no PDFs listed - upload one to newsletters/ to test file + cover)"
fi

echo
echo "3. Rejects bad input"
check "traversal key"        "$(code "$BASE/api/newsletter-file?key=../../etc/passwd")" "400"
check "key outside prefix"   "$(code "$BASE/api/newsletter-file?key=secrets/x.pdf")" "400"
check "non-pdf key"          "$(code "$BASE/api/newsletter-file?key=newsletters/x.txt")" "400"
check "image bad prefix"     "$(code "$BASE/api/drive-image?key=../etc/passwd")" "400"
check "image missing params" "$(code "$BASE/api/drive-image")" "400"

echo
echo "4. Upload endpoint is locked down"
check "upload without token"  "$(curl -s -o /dev/null -w '%{http_code}' -m 25 -X POST "$BASE/api/newsletter-upload")" "401"
check "upload with bad token" "$(curl -s -o /dev/null -w '%{http_code}' -m 25 -X POST -H 'x-upload-token: nope' "$BASE/api/newsletter-upload")" "401"

echo
echo "5. Cover falls back when no image exists"
check "placeholder cover"    "$(code "$BASE/api/newsletter-thumb?key=newsletters/Nothing_Here.pdf")" "200"

echo
echo "$pass passed, $fail failed"
[ "$fail" -eq 0 ]
