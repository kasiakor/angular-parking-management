import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';
import { IBuilding, IFloor, ISite } from '../../interfaces/master.interface';
import {
  IParkingReservationRequest,
  IParkingResponse,
} from '../../interfaces/parking.interface';
import { ParkingService } from '../../services/parking.service';
import { SitesService } from '../../services/sites.service';

// parking-layout
type SpotStatus = 'available' | 'occupied' | 'reserved' | 'maintenance';

interface Spot {
  id: string; // A1
  status: SpotStatus;
}
@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, AfterViewInit {
  sitesService = inject(SitesService);
  parkingService = inject(ParkingService);

  spots: Spot[] = [];
  siteData: ISite[] = [];
  buildingData: IBuilding[] = [];
  floorData: IFloor[] = [];
  parkingData: IParkingResponse[] = [];
  floorId: number | null = null;
  selectedSiteId: number | null = null;
  selectedBuildingId: number | null = null;
  selectedFloorId: number | null = null;
  totalParkingSpots: number = 0;

  // form fields
  custName = '';
  custMobileNo = '';
  vehicleNo = '';
  amount: number | null = null;

  parkId: number = 0;
  parkSpotNo!: number;
  parkDate!: string;

  selectedSpotId: string | null = null;
  selectedSpotStatus: SpotStatus | null = null;

  @ViewChild('bookSpotModal')
  modalEl!: ElementRef<HTMLElement>;

  @ViewChild('releaseSpotModal')
  releaseModalEl!: ElementRef<HTMLElement>;

  releaseModal!: Modal;

  private modal!: Modal;

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

  ngAfterViewInit() {
    this.modal = new Modal(this.modalEl.nativeElement);
    this.releaseModal = new Modal(this.releaseModalEl.nativeElement);
  }

  openBookSpotModal(spotId: string) {
    this.selectedSpotId = spotId;
    this.modal.show();
  }

  openReleaseSpotModal(spotId: string) {
    this.selectedSpotId = spotId;
    this.releaseModal.show();
  }

  onSpotClick(spot: { id: string; status: string }) {
    if (spot.status === 'available') {
      this.openBookSpotModal(spot.id);
      return;
    }

    if (spot.status === 'occupied') {
      this.openReleaseSpotModal(spot.id);
      return;
    }

    // optional: ignore other states
  }

  generateRandomSpots(total: number) {
    const statuses: SpotStatus[] = [
      'available',
      'occupied',
      'reserved',
      'maintenance',
    ];

    this.spots = [];

    for (let i = 1; i <= total; i++) {
      this.spots.push({
        id: `A${i}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
      });
    }
    console.log('Generated spots:', this.spots);
  }

  onSiteChange(siteId: number | null): void {
    const selectedSite = this.siteData.find((site) => site.siteId === siteId);
    console.log('Selected site:', selectedSite);

    this.sitesService.GetBuildingBySiteId(siteId!).subscribe({
      next: (response) => {
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
        this.floorData = response.data;
        this.floorId = this.floorData[0]?.floorId || null;
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

  onFloorChange(): void {
    this.sitesService.GetParkingByFloorId(this.floorId!).subscribe({
      next: (response) => {
        console.log('Parking data for floor ID', this.floorId, ':', response);
        this.parkingData = response.data;
        this.totalParkingSpots = this.parkingData.length;
        this.generateRandomSpots(this.totalParkingSpots);
      },
      error: (error) => {
        console.error(
          'Error loading parking data for floor ID',
          this.floorId,
          ':',
          error,
        );
      },
    });
  }

  onReservationSuccess() {
    if (this.selectedSpotId == null) return;

    const spot = this.spots.find((s) => s.id === this.selectedSpotId);
    if (spot) {
      spot.status = 'reserved'; // 🔥 update UI state
    }

    this.modal.hide();
    this.selectedSpotId = null;
  }

  submitReservation() {
    alert('Submitting reservation...');
    const payload: IParkingReservationRequest = {
      parkId: this.parkId,
      floorId: this.floorId!,
      custName: this.custName,
      custMobileNo: this.custMobileNo,
      vehicleNo: this.vehicleNo,
      parkDate: new Date().toISOString().split('T')[0],
      parkSpotNo: Number(this.selectedSpotId?.replace('A', '')),
      inTime: new Date().toISOString(),
      outTime: '', // empty initially
      amount: this.amount ?? 0,
      extraCharge: 0,
      parkingNo: this.selectedSpotId!,
    };

    console.log(payload);

    this.parkingService.parkingReservation(payload).subscribe({
      next: (response) => {
        console.log('Reservation successful:', response);
        this.onReservationSuccess();
      },
      error: (error) => {
        console.error('Error making reservation:', error);
      },
    });
  }

  // claculation logic
  get totalSpots(): number {
    return this.spots.length;
  }

  get availableCount(): number {
    return this.spots.filter((s) => s.status === 'available').length;
  }

  get occupiedCount(): number {
    return this.spots.filter((s) => s.status === 'occupied').length;
  }

  get reservedCount(): number {
    return this.spots.filter((s) => s.status === 'reserved').length;
  }

  get maintenanceCount(): number {
    return this.spots.filter((s) => s.status === 'maintenance').length;
  }

  // "Taken" = occupied + reserved
  get takenCount(): number {
    return this.occupiedCount + this.reservedCount;
  }

  // Capacity excludes maintenance
  get usableCapacity(): number {
    return this.totalSpots - this.maintenanceCount;
  }

  // % = taken / usable * 100
  get occupancyRate(): number {
    const cap = this.usableCapacity;
    if (cap <= 0) return 0;
    return Math.round((this.takenCount / cap) * 100);
  }
}
