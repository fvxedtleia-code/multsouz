class ARApp {
    constructor() {
        this.qrScanner = null;
        this.arRenderer = null;
        this.photoCapture = null;
    }

    initScannerPage() {
        this.qrScanner = initQRScanner('camera-video', (qrData) => {
            this.onQRDetected(qrData);
        });

        this.qrScanner.start();

        document.getElementById('photo-btn').addEventListener('click', () => {
            this.photoCapture?.captureAndDownload();
        });

        window.addEventListener('resize', () => {
            this.arRenderer?.resize();
        });
    }

    async onQRDetected(qrData) {
        document.getElementById('scan-overlay').style.display = 'none';
        document.getElementById('ar-container').style.display = 'block';
        document.getElementById('photo-btn').style.display = 'block';

        const modelData = this.parseQRData(qrData);
        this.arRenderer = initARRenderer('ar-canvas');
        
        await this.arRenderer.loadModel(`models/${modelData.model}.glb`);
        this.arRenderer.setModelPosition(...modelData.position);
        this.arRenderer.setModelScale(modelData.scale);
        this.arRenderer.start();

        this.photoCapture = initPhotoCapture(this.arRenderer);
    }

    parseQRData(qrData) {
        try {
            const params = {};
            qrData.split(',').forEach(param => {
                const [key, value] = param.split(':');
                params[key] = value;
            });
            return {
                model: params.model || 'default',
                position: params.pos ? params.pos.split(',').map(Number) : [0, 1.5, -3],
                scale: parseFloat(params.scale) || 1
            };
        } catch (e) {
            return { model: 'default', position: [0, 1.5, -3], scale: 1 };
        }
    }
}

window.arApp = new ARApp();