class QRScanner {
    constructor(videoElement, onQRDetected) {
        this.video = videoElement;
        this.onQRDetected = onQRDetected;
        this.isScanning = false;
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
    }

    async start() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            this.video.srcObject = stream;
            await this.video.play();
            this.isScanning = true;
            this.startScanLoop();
            return true;
        } catch (error) {
            console.error('Camera error:', error);
            return false;
        }
    }

    startScanLoop() {
        const scanFrame = () => {
            if (!this.isScanning) return;

            if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
                this.canvas.width = this.video.videoWidth;
                this.canvas.height = this.video.videoHeight;
                this.context.drawImage(this.video, 0, 0);
                const imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
                
                try {
                    const code = jsQR(imageData.data, imageData.width, imageData.height);
                    if (code) {
                        this.stop();
                        this.onQRDetected(code.data);
                    }
                } catch (e) {}
            }

            if (this.isScanning) requestAnimationFrame(scanFrame);
        };
        scanFrame();
    }

    stop() {
        this.isScanning = false;
        if (this.video.srcObject) {
            this.video.srcObject.getTracks().forEach(track => track.stop());
        }
    }
}

window.initQRScanner = function(videoElementId, onQRDetected) {
    const video = document.getElementById(videoElementId);
    return video ? new QRScanner(video, onQRDetected) : null;
};