export default {
    data: {
        title: '喝水提醒',
        totalMl: 1200,
        targetMl: 2000,
        progressText: '60%',
        progressRingSrc: '/common/images/progress_ring_060.png',
        defaultAmountMl: 200,
        isWaterMoving: false,
        statusText: '下一次提醒 15:30'
    },
    onInit() {
        this.updateProgress();
    },
    updateProgress() {
        const progress = Math.min(100, Math.round(this.totalMl / this.targetMl * 100));
        this.progressText = progress + '%';
        const paddedProgress = progress < 10 ? '00' + progress : progress < 100 ? '0' + progress : '' + progress;
        this.progressRingSrc = '/common/images/progress_ring_' + paddedProgress + '.png';
    },
    onAddWater() {
        this.totalMl += this.defaultAmountMl;
        this.updateProgress();
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
