export default {
    data: {
        title: '喝水提醒',
        totalMl: 1200,
        targetMl: 2000,
        progressText: '60%',
        defaultAmountMl: 200,
        isHomeView: true,
        isQuickAddView: false,
        isWaterMoving: false,
        statusText: '下一次提醒 15:30'
    },
    onInit() {
        this.updateProgress();
    },
    onShow() {
        this.drawProgressRing();
    },
    updateProgress() {
        const progress = Math.min(100, Math.round(this.totalMl / this.targetMl * 100));
        this.progressText = progress + '%';
    },
    showHomeView() {
        this.isHomeView = true;
        this.isQuickAddView = false;
    },
    showQuickAddView() {
        this.isHomeView = false;
        this.isQuickAddView = true;
    },
    drawProgressRing() {
        if (!this.$refs || !this.$refs.progressCanvas) {
            return;
        }

        const canvas = this.$refs.progressCanvas;
        const ctx = canvas.getContext('2d', { antialias: true });
        const progress = Math.min(100, Math.max(0, Math.round(this.totalMl / this.targetMl * 100)));
        const center = 227;
        const ringRadius = 217;
        const ringWidth = 20;
        const fullCircle = Math.PI * 2;
        const startAngle = -Math.PI / 2;
        const endAngle = progress >= 100 ? startAngle + fullCircle : startAngle + fullCircle * progress / 100;

        ctx.beginPath();
        ctx.lineWidth = ringWidth;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#E8E8E8';
        ctx.arc(center, center, ringRadius, 0, fullCircle);
        ctx.stroke();

        if (progress > 0) {
            ctx.beginPath();
            ctx.lineWidth = ringWidth;
            ctx.lineCap = 'round';
            ctx.strokeStyle = '#0A84FF';
            ctx.arc(center, center, ringRadius, startAngle, endAngle);
            ctx.stroke();

            const startCenterX = center + Math.cos(startAngle) * ringRadius;
            const startCenterY = center + Math.sin(startAngle) * ringRadius;
            const endCenterX = center + Math.cos(endAngle) * ringRadius;
            const endCenterY = center + Math.sin(endAngle) * ringRadius;

            if (progress < 100) {
                ctx.beginPath();
                ctx.lineWidth = ringWidth;
                ctx.strokeStyle = '#0A84FF';
                ctx.arc(startCenterX, startCenterY, 1, 0, fullCircle);
                ctx.stroke();

                ctx.beginPath();
                ctx.lineWidth = ringWidth;
                ctx.strokeStyle = '#0A84FF';
                ctx.arc(endCenterX, endCenterY, 1, 0, fullCircle);
                ctx.stroke();
            }
        }
    },
    onAddWater() {
        this.onOpenQuickAdd();
    },
    onOpenQuickAdd() {
        this.showQuickAddView();
    },
    onCancelQuickAdd() {
        this.showHomeView();
        this.drawProgressRing();
    },
    addWaterAmount(amountMl) {
        this.totalMl += amountMl;
        this.updateProgress();
        this.showHomeView();
        this.drawProgressRing();
        this.isWaterMoving = true;
        this.statusText = '已记录 ' + amountMl + ' mL';

        if (typeof setTimeout === 'function') {
            setTimeout(() => {
                this.isWaterMoving = false;
            }, 450);
        }
    },
    onQuickAdd100() {
        this.addWaterAmount(100);
    },
    onQuickAdd200() {
        this.addWaterAmount(200);
    },
    onQuickAdd300() {
        this.addWaterAmount(300);
    },
    onOpenHistory() {
        this.statusText = '记录页将在下一步实现';
    },
    onOpenSettings() {
        this.statusText = '设置页将在下一步实现';
    }
};
