class PhotoCapture {
    constructor(arRenderer) {
        this.arRenderer = arRenderer;
    }

    capture() {
        const canvas = document.createElement('canvas');
        canvas.width = this.arRenderer.renderer.domElement.width;
        canvas.height = this.arRenderer.renderer.domElement.height;
        const context = canvas.getContext('2d');
        context.drawImage(this.arRenderer.renderer.domElement, 0, 0);
        return canvas.toDataURL('image/png');
    }

    download(dataUrl, filename = 'ar-photo.png') {
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    captureAndDownload() {
        const photoData = this.capture();
        if (photoData) this.download(photoData);
    }
}

window.initPhotoCapture = function(arRenderer) {
    return new PhotoCapture(arRenderer);
};