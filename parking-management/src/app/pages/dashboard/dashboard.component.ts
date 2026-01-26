import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IBuilding, IFloor, ISite } from '../../interfaces/master.interface';
import { SitesService } from '../../services/sites.service';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  sitesService = inject(SitesService);

  siteData: ISite[] = [];
  buildingData: IBuilding[] = [];
  floorData: IFloor[] = [];
  selectedSiteId: number | null = null;
  selectedBuildingId: number | null = null;
  selectedFloorId: number | null = null;

  ngOnInit(): void {
    this.sitesService.getSitesByClientId().subscribe({
      next: (response) => {
        this.siteData = response.data;
        console.log('Sites data loaded:', this.siteData);
      },
      error: (error) => {
        console.error('Error loading sites data:', error);
      },
    });
  }

  onSiteChange(siteId: number | null): void {
    const selectedSite = this.siteData.find((site) => site.siteId === siteId);
    console.log('Selected site:', selectedSite);

    this.sitesService.GetBuildingBySiteId(siteId!).subscribe({
      next: (response) => {
        debugger;
        this.buildingData = response.data;
        console.log('Buildings data for site ID', siteId, ':', response.data);
      },
      error: (error) => {
        console.error(
          'Error loading buildings data for site ID',
          siteId,
          ':',
          error,
        );
      },
    });
  }

  onBuildingChange(buildingId: number | null): void {
    const selectedBuilding = this.buildingData.find(
      (building) => building.buildingId === buildingId,
    );
    console.log('Selected building:', selectedBuilding);
    this.sitesService.GetFloorsByBuildingId(buildingId!).subscribe({
      next: (response) => {
        debugger;
        this.floorData = response.data;
        console.log(
          'Floors data for building ID',
          buildingId,
          ':',
          response.data,
        );
      },
      error: (error) => {
        console.error(
          'Error loading floors data for building ID',
          buildingId,
          ':',
          error,
        );
      },
    });
  }
}
