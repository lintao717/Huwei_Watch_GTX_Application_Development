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
        const ctx = canvas.getContext('2d');
        const progress = Math.min(100, Math.max(0, Math.round(this.totalMl / this.targetMl * 100)));
        const startAngle = -1.08;
        const maxSweep = 3.02;
        const endAngle = startAngle + maxSweep * progress / 100;

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#E5E5EA';
        ctx.arc(227, 227, 210, 0, 6.28);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = 14;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#0A84FF';
        ctx.arc(227, 227, 210, startAngle, endAngle);
        ctx.stroke();
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
