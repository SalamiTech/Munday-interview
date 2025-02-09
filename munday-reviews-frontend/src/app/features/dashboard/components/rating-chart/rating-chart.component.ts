import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    Chart,
    ChartConfiguration,
    ChartData,
    ChartType,
    TooltipItem
} from 'chart.js';
import { CategoryScale, LinearScale, BarController, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the required Chart.js components
Chart.register(CategoryScale, LinearScale, BarController, BarElement, Title, Tooltip, Legend);

@Component({
    selector: 'app-rating-chart',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './rating-chart.component.html',
    styleUrls: ['./rating-chart.component.scss']
})
export class RatingChartComponent implements OnChanges, OnDestroy {
    @Input() ratingDistribution!: { [key: number]: number };
    @Input() title = 'Rating Distribution';
    @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

    private chart: Chart | null = null;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['ratingDistribution'] && this.chartCanvas) {
            this.updateChart();
        }
    }

    ngOnDestroy(): void {
        if (this.chart) {
            this.chart.destroy();
        }
    }

    private updateChart(): void {
        const labels = Object.keys(this.ratingDistribution).map(Number);
        const data = Object.values(this.ratingDistribution);
        const total = data.reduce((sum, value) => sum + value, 0);

        const chartData: ChartData<'bar'> = {
            labels: labels.map(label => `${label} Star${label !== 1 ? 's' : ''}`),
            datasets: [{
                label: 'Reviews',
                data: data,
                backgroundColor: this.generateGradientColors(data.length),
                borderColor: 'transparent',
                borderRadius: 8,
                barThickness: 32,
                maxBarThickness: 48
            }]
        };

        const config: ChartConfiguration<'bar'> = {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: this.title,
                        color: '#1E293B',
                        font: {
                            size: 16,
                            weight: 600
                        },
                        padding: {
                            bottom: 16
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context: TooltipItem<'bar'>) => {
                                const value = context.raw as number;
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${value} reviews (${percentage}%)`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#64748B',
                            font: {
                                size: 12
                            }
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#64748B',
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        };

        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(this.chartCanvas.nativeElement, config);
    }

    private generateGradientColors(count: number): string[] {
        const baseColor = '#3B82F6';
        const opacity = 0.9;
        return Array(count).fill(0).map((_, index) => {
            const darkenAmount = (index / count) * 20;
            return this.adjustColor(baseColor, -darkenAmount, opacity);
        });
    }

    private adjustColor(hex: string, percent: number, opacity: number): string {
        const num = parseInt(hex.replace('#', ''), 16);
        const r = (num >> 16) + percent;
        const g = ((num >> 8) & 0x00FF) + percent;
        const b = (num & 0x0000FF) + percent;

        const newR = Math.min(255, Math.max(0, r));
        const newG = Math.min(255, Math.max(0, g));
        const newB = Math.min(255, Math.max(0, b));

        return `rgba(${newR}, ${newG}, ${newB}, ${opacity})`;
    }
} 