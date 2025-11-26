#!/bin/bash

# Function to download image
download_image() {
    url="https://unsplash.com/photos/$1/download?force=true"
    output="assets/images/$2"
    echo "Downloading $2..."
    curl -L -o "$output" "$url"
}

# Hero & Interior
download_image "qE1jxYXiwOA" "hero-bg.jpg" "1920"
download_image "gHrgeeCCkYA" "about-interior.jpg" "800"
download_image "lzg4B4shScg" "gallery-1.jpg" "800"

# Coffee
download_image "nzyzAUsbV0M" "latte.jpg" "800"
download_image "vfiA7rRtjWo" "cappuccino.jpg" "800"
download_image "WLk7wdUpKXc" "americano.jpg" "800"

# Food
download_image "8JklXjB2X3w" "chicken-sub.jpg" "800"
download_image "xzT7w8paUr4" "cheese-toastie.jpg" "800"
download_image "YjC-tI2r7xM" "croissant.jpg" "800"
download_image "5RQffqRkmWQ" "muffin.jpg" "800"

# Extra Gallery
download_image "CDAOrX5Jq9I" "gallery-2.jpg" "800"
download_image "0-xIKrdFj4I" "gallery-3.jpg" "800"

echo "Download complete."
