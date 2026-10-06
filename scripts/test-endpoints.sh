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

# Newsletters come from Google Drive, so ids are Drive file ids and the
# S3 file/cover routes below do not apply to them.
if printf '%s' "$body" | grep -q '"id"'; then
  echo "   feed returned issues"
else
  echo "   (feed returned no issues - check DRIVE_API_KEY and folder sharing)"
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
echo "5. S3 file route still guards its prefix"
check "S3 file route rejects bad key" "$(code "$BASE/api/newsletter-file?key=nope/x.pdf")" "400"

echo
echo "$pass passed, $fail failed"
[ "$fail" -eq 0 ]
