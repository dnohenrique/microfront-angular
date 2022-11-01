import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { marker } from '../../support/marker.image';
import { proj } from 'openlayers';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { GeoLocationService } from '../../support/geo.location.service';
import { Common } from '../../support/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';


@Component({
  selector: 'fc-availability-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {

  constructor(
    private httpClient: HttpClient,
    private geoLocationService: GeoLocationService,
    public common: Common,
    private modalService: BsModalService
  ) {
  }

  @Input() geoReverseService = 'https://nominatim.openstreetmap.org/reverse?' +
    'key=iTzWSiYpGxDvhATNtSrqx5gDcnMOkntL&format=json&addressdetails=1&lat={lat}&lon={lon}';
  @Input() width: string;
  @Input() height: string;
  @Input() latitude = 0;
  @Input() longitude = 0;
  @Input() latitudePointer = 0;
  @Input() longitudePointer = 0;
  @Input() showControlsZoom: boolean;
  @Input() titleZoomIn = 'Zoom in';
  @Input() titleZoomOut = 'Zoom out';
  @Input() showControlsCurrentLocation: boolean;
  @Input() titleCurrentLocation = 'Current location';
  @Input() opacity = 1;
  @Input() zoom = 18;
  @Input() modalRef: any;
  @Input() nameHotel: string;
  @Input() listCategory: any;
  @Input() andress: number;
  viewText = true;
  markerImage = marker;
  reverseGeoSub: Subscription = null;
  pointedAddress: string;
  pointedAddressOrg: string;
  position: any;
  dirtyPosition: any;

  @Output() addressChanged = new EventEmitter<string>();

  ngOnInit() {
    this.modalService.onHide.subscribe((reason: string) => {
      this.common.showBodyScroll();
    });

    if (this.showControlsCurrentLocation) {
      this.geoLocationService.getLocation().subscribe((position) => {
        this.position = position;
        if (!this.dirtyPosition) {
          this.dirtyPosition = true;
          this.longitude = this.longitudePointer = this.position.coords.longitude;
          this.latitude = this.latitudePointer = this.position.coords.latitude;
        }
      });
    }
  }

  hideModal() {
    this.modalRef.hide();
  }

  ngOnDestroy() {
    if (this.reverseGeoSub) {
      this.reverseGeoSub.unsubscribe();
    }
  }

  increaseOpacity() {
    this.opacity += 0.1;
  }

  decreaseOpacity() {
    this.opacity -= 0.1;
  }
  increaseZoom() {
    this.zoom++;
  }
  decreaseZoom() {
    this.zoom--;
  }

  setCurrentLocation(event) {
    // TODO FIX: setting current location does move the pointer but not the map!!!
    if (this.position) {
      this.longitude = this.longitudePointer = this.position.coords.longitude;
      this.latitude = this.latitudePointer = this.position.coords.latitude;
      /**
       * Trigger new address change
       */
      this.reverseGeo();
    }
  }

  reverseGeo() {
    const service = (this.geoReverseService || '')
      .replace(new RegExp('{lon}', 'ig'), `${this.longitudePointer}`)
      .replace(new RegExp('{lat}', 'ig'), `${this.latitudePointer}`);
    this.reverseGeoSub = this.httpClient.get(service).subscribe(data => {
      const val: any = (data || {});
      const zipCity: any[] = [];
      const streetNumber: any[] = [];
      this.pointedAddressOrg = val.display_name;
      const address = [];
      const building = [];
      if (val.address.building) {
        building.push(val.address.building);
      }
      if (val.address.mall) {
        building.push(val.address.mall);
      }
      if (val.address.theatre) {
        building.push(val.address.theatre);
      }
      if (val.address.postcode) {
        zipCity.push(val.address.postcode);
      }
      if (val.address.city) {
        zipCity.push(val.address.city);
      }
      if (val.address.street) {
        streetNumber.push(val.address.street);
      }
      if (val.address.road) {
        streetNumber.push(val.address.road);
      }
      if (val.address.footway) {
        streetNumber.push(val.address.footway);
      }
      if (val.address.pedestrian) {
        streetNumber.push(val.address.pedestrian);
      }
      if (val.address.house_number) {
        streetNumber.push(val.address.house_number);
      }
      if (building.length) {
        address.push(building.join(' '));
      }
      if (zipCity.length) {
        address.push(zipCity.join(' '));
      }
      if (streetNumber.length) {
        address.push(streetNumber.join(' '));
      }

      this.pointedAddress = address.join(', ');

      this.addressChanged.emit(this.pointedAddress);
    });
  }

}
