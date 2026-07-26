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
    onShow() {
        this.drawProgressRing();
    },
    updateProgress() {
        const progress = Math.min(100, Math.round(this.totalMl / this.targetMl * 100));
        this.progressText = progress + '%';
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
        const halfRingWidth = ringWidth / 2;
        const outerRadius = ringRadius + halfRingWidth;
        const innerRadius = ringRadius - halfRingWidth;
        const fullCircle = Math.PI * 2;
        const startAngle = -Math.PI / 2;
        const endAngle = progress >= 100 ? startAngle + fullCircle : startAngle + fullCircle * progress / 100;

        ctx.beginPath();
        ctx.lineWidth = ringWidth;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#E8E8E8';
        ctx.arc(center, center, ringRadius, 0, fullCircle);
        ctx.stroke();

        if (progress >= 100) {
            ctx.beginPath();
            ctx.lineWidth = ringWidth;
            ctx.lineCap = 'round';
            ctx.strokeStyle = '#0A84FF';
            ctx.arc(center, center, ringRadius, 0, fullCircle);
            ctx.stroke();
        } else if (progress > 0) {
            const startCenterX = center + Math.cos(startAngle) * ringRadius;
            const startCenterY = center + Math.sin(startAngle) * ringRadius;
            const endCenterX = center + Math.cos(endAngle) * ringRadius;
            const endCenterY = center + Math.sin(endAngle) * ringRadius;
            const startOuterX = center + Math.cos(startAngle) * outerRadius;
            const startOuterY = center + Math.sin(startAngle) * outerRadius;

            ctx.beginPath();
            ctx.fillStyle = '#0A84FF';
            ctx.moveTo(startOuterX, startOuterY);
            ctx.arc(center, center, outerRadius, startAngle, endAngle);
            ctx.arc(endCenterX, endCenterY, halfRingWidth, endAngle, endAngle + Math.PI);
            ctx.arc(center, center, innerRadius, endAngle, startAngle, true);
            ctx.arc(startCenterX, startCenterY, halfRingWidth, startAngle + Math.PI, startAngle);
            if (typeof ctx.closePath === 'function') {
                ctx.closePath();
            }
            ctx.fill();
        }
    },
    onAddWater() {
        this.totalMl += this.defaultAmountMl;
        this.updateProgress();
        this.drawProgressRing();
        this.isWaterMoving = true;
        this.statusText = '已记录 ' + this.defaultAmountMl + ' mL';

        if (typeof setTimeout === 'function') {
            setTimeout(() => {
                this.isWaterMoving = false;
            }, 450);
        }
    },
    onOpenHistory() {
        this.statusText = '记录页将在下一步实现';
    },
    onOpenSettings() {
        this.statusText = '设置页将在下一步实现';
    }
};
