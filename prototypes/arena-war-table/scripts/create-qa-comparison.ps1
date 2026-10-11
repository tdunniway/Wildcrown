Add-Type -AssemblyName System.Drawing

$referencePath = Resolve-Path "public\assets\arena-war-table-reference.png"
$implementationPath = Resolve-Path "qa\implementation.png"
$outputPath = Join-Path (Resolve-Path "qa") "reference-vs-implementation.png"

$reference = [System.Drawing.Image]::FromFile($referencePath)
$implementation = [System.Drawing.Image]::FromFile($implementationPath)
$canvas = New-Object System.Drawing.Bitmap 2560, 720
$graphics = [System.Drawing.Graphics]::FromImage($canvas)

$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.DrawImage($reference, 0, 0, 1280, 720)
$graphics.DrawImage($implementation, 1280, 0, 1280, 720)

$dividerPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 243, 213, 136)), 2
$graphics.DrawLine($dividerPen, 1279, 0, 1279, 720)

$canvas.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)

$dividerPen.Dispose()
$graphics.Dispose()
$canvas.Dispose()
$implementation.Dispose()
$reference.Dispose()

Write-Output $outputPath
