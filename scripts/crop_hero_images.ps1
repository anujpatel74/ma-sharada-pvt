Add-Type -AssemblyName System.Drawing

function Crop-Image($filePath, $outPath, $cropTop, $cropBottom, $cropLeft, $cropRight) {
    $src = [System.Drawing.Bitmap]::FromFile($filePath)
    $w = $src.Width - $cropLeft - $cropRight
    $h = $src.Height - $cropTop - $cropBottom
    $rect = New-Object System.Drawing.Rectangle($cropLeft, $cropTop, $w, $h)
    $dest = $src.Clone($rect, $src.PixelFormat)
    $src.Dispose()
    
    $encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
    $encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]95)
    
    $dest.Save($outPath, $encoder, $encParams)
    $dest.Dispose()
    Write-Host "Saved cropped image to $outPath ($w x $h)"
}

# Shop interior: top 108px, bottom 68px
Crop-Image 'e:\MAA-SHARDA PVT\public\images\real_photos\shop_real_interior.jpg' 'e:\MAA-SHARDA PVT\public\images\real_photos\shop_real_interior_clean.jpg' 108 68 0 0

# Banner: top 53px, bottom 130px
Crop-Image 'e:\MAA-SHARDA PVT\public\images\real_photos\real_exide_battery_banner.jpg' 'e:\MAA-SHARDA PVT\public\images\real_photos\real_exide_battery_banner_clean.jpg' 53 130 0 0
