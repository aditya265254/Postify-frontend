$paths = @(
  "src\pages\Dashboard.jsx",
  "src\pages\CreatePost.jsx",
  "src\pages\MyPosts.jsx",
  "src\pages\Login.jsx",
  "src\pages\Signup.jsx",
  "src\pages\AdminDashbord.jsx",
  "src\pages\AdminUserPosts.jsx",
  "src\components\MyPostList.jsx",
  "src\components\Navbar.jsx",
  "src\pages\VerifyEmail.jsx"
)

foreach ($p in $paths) {
  if (Test-Path $p) {
    $c = Get-Content $p -Raw
    # bg tokens
    $c = $c -replace '\[#1A1A1C\]', '[#1E1E24]'
    $c = $c -replace '\[#141214\]', '[#1E1E24]'
    $c = $c -replace '\[#242427\]', '[#28282F]'
    $c = $c -replace '\[#1c1a1e\]', '[#28282F]'
    $c = $c -replace '\[#2C2C2F\]', '[#303038]'
    $c = $c -replace '\[#201e22\]', '[#303038]'
    $c = $c -replace '\[#3A3A3E\]', '[#3E3E48]'
    $c = $c -replace '\[#2e2b31\]', '[#3E3E48]'
    $c = $c -replace '\[#2a2730\]', '[#303038]'
    $c = $c -replace '\[#302d37\]', '[#38383F]'
    $c = $c -replace '\[#1E1E21\]', '[#22222A]'
    $c = $c -replace '\[#181619\]', '[#22222A]'
    $c = $c -replace 'dark:bg-zinc-950', 'dark:bg-[#1E1E24]'
    $c = $c -replace 'dark:bg-zinc-900(?!\d)', 'dark:bg-[#28282F]'
    $c = $c -replace 'dark:bg-zinc-800(?!\d)', 'dark:bg-[#303038]'
    $c = $c -replace 'dark:border-zinc-800', 'dark:border-[#3E3E48]'
    $c = $c -replace 'dark:border-zinc-700', 'dark:border-[#3E3E48]'
    $c = $c -replace 'dark:hover:bg-zinc-800', 'dark:hover:bg-[#38383F]'
    $c = $c -replace 'dark:hover:bg-zinc-700', 'dark:hover:bg-[#38383F]'
    Set-Content $p $c
    Write-Host "Done: $p"
  }
}
Write-Host "All updated!"
