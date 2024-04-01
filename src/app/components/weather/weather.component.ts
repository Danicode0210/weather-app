import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WeatherApiService } from '../../services/weather-api.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit, OnDestroy {
  location: string = '';
  forecastData: any;
  chart: any;

  constructor(private route: ActivatedRoute, private weatherService: WeatherApiService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('location');
      if (id !== null) {
        this.location = id;
        this.getForecastData(this.location);
      } else {
        console.error('El ID es nulo');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  getForecastData(location: string): void {
    this.weatherService.getForecast(location).subscribe(data => {
      if (data && data.properties && data.properties.periods) {
        this.forecastData = data.properties.periods;
        this.createChart();
      } else {
        console.error('Formato de datos inesperado:', data);
      }
    });
  }

  createChart(): void {
    if (!this.forecastData || this.forecastData.length === 0) {
      console.error('Los datos de pronóstico son nulos o vacíos');
      return;
    }

    const labels = this.forecastData.map((period: any) => period.name);
    const temperatures = this.forecastData.map((period: any) => period.temperature);

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Temperature',
            data: temperatures,
            borderColor: '#3cba9f',
            backgroundColor: 'rgba(60, 186, 159, 0.2)', 
            fill: true
          }
        ]
      },
      options: {
        plugins: {
          legend: {
            display: false 
          }
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Time',
              color: '#333', 
              font: {
                weight: 'bold' 
              }
            },
            grid: {
              display: false 
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Temperature (°F)',
              color: '#333',
              font: {
                weight: 'bold'
              }
            },
            grid: {
              color: '#eee' 
            }
          }
        },
        interaction: {
          mode: 'nearest', 
          intersect: false 
        }
      }
    });
  }
}
