export default {
    data: {
        title: '喝水提醒',
        totalMl: 1200,
        targetMl: 2000,
        progressText: '60%',
        defaultAmountMl: 200,
        isWaterMoving: false,
        statusText: '下一次提醒 15:30'
    },
    onInit() {
        this.updateProgress();
    },
    onReady() {
        this.canvas = this.$refs.homeCanvas;
        this.context = this.canvas.getContext('2d');
        this.drawHome();
    },
    updateProgress() {
        const progress = Math.min(100, Math.round(this.totalMl / this.targetMl * 100));
        this.progressText = progress + '%';
    },
    onAddWater() {
        this.totalMl += this.defaultAmountMl;
        this.updateProgress();
        this.isWaterMoving = true;
        this.statusText = '已记录 ' + this.defaultAmountMl + ' mL';
        this.drawHome();

        if (typeof setTimeout === 'function') {
            setTimeout(() => {
                this.isWaterMoving = false;
            }, 450);
        }
    },
    onOpenHistory() {
        this.statusText = '记录页将在下一步实现';
        this.drawHome();
    },
    onOpenSettings() {
        this.statusText = '设置页将在下一步实现';
        this.drawHome();
    },
    onCanvasTouch(event) {
        const touch = event.touches && event.touches[0] ? event.touches[0] : event;
        const x = touch.localX || touch.x || 0;
        const y = touch.localY || touch.y || 0;
        if (x >= 93 && x <= 361 && y >= 252 && y <= 314) {
            this.onAddWater();
        } else if (x >= 118 && x <= 215 && y >= 335 && y <= 382) {
            this.onOpenHistory();
        } else if (x >= 240 && x <= 340 && y >= 335 && y <= 382) {
            this.onOpenSettings();
        }
    },
    drawHome() {
        if (!this.context) {
            return;
        }
        const ctx = this.context;
        const progress = Math.min(1, this.totalMl / this.targetMl);
        ctx.clearRect(0, 0, 454, 454);
        ctx.fillStyle = '#F8F8FC';
        ctx.fillRect(0, 0, 454, 454);
        ctx.beginPath();
        ctx.arc(227, 227, 219, 0, Math.PI * 2);
        ctx.strokeStyle = '#E5E5EA';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(227, 227, 196, -1.16, -1.16 + Math.PI * 2 * progress);
        ctx.strokeStyle = '#0A84FF';
        ctx.lineWidth = 13;
        ctx.lineCap = 'round';
        ctx.stroke();
        this.drawText(ctx, '10:08', 227, 53, 19, '#1C1C1E', 'center');
        this.drawText(ctx, String(this.totalMl), 213, 171, 54, '#1C1C1E', 'right', true);
        this.drawText(ctx, '/ ' + this.targetMl + ' mL', 223, 171, 23, '#1C1C1E', 'left');
        ctx.beginPath();
        ctx.arc(158, 209, 11, 0, Math.PI * 2);
        ctx.fillStyle = '#0A84FF';
        ctx.fill();
        this.drawText(ctx, this.progressText + ' · 今日进度', 183, 220, 21, '#636366', 'left');
        this.drawButton(ctx);
        this.drawBottomActions(ctx);
    },
    drawText(ctx, text, x, y, size, color, align, bold) {
        ctx.fillStyle = color;
        ctx.font = (bold ? 'bold ' : '') + size + 'px sans-serif';
        ctx.textAlign = align;
        ctx.textBaseline = 'alphabetic';
        ctx.fillText(text, x, y);
    },
    drawButton(ctx) {
        ctx.beginPath();
        ctx.arc(124, 283, 31, Math.PI / 2, Math.PI * 1.5);
        ctx.arc(330, 283, 31, Math.PI * 1.5, Math.PI / 2);
        ctx.closePath();
        ctx.fillStyle = '#0A84FF';
        ctx.fill();
        this.drawText(ctx, '+' + this.defaultAmountMl + ' mL', 227, 292, 26, '#FFFFFF', 'center');
    },
    drawBottomActions(ctx) {
        ctx.strokeStyle = '#636366';
        ctx.lineWidth = 3;
        ctx.strokeRect(125, 344, 21, 24);
        this.drawText(ctx, '记录', 157, 365, 22, '#3A3A3C', 'left');
        for (let index = 0; index < 8; index++) {
            const angle = Math.PI * 2 * index / 8;
            const startX = 274 + Math.cos(angle) * 13;
            const startY = 356 + Math.sin(angle) * 13;
            const endX = 274 + Math.cos(angle) * 18;
            const endY = 356 + Math.sin(angle) * 18;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(274, 356, 13, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(274, 356, 4, 0, Math.PI * 2);
        ctx.stroke();
        this.drawText(ctx, '设置', 298, 365, 22, '#3A3A3C', 'left');
    }
};
