import { Directive, ElementRef, OnInit } from '@angular/core';
import { MessageService } from '../services/message.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ApiService } from '../services/api.service';
import { FunctionService } from '../services/function.service';
declare var Cesium: any;
declare var CesiumNavigation: any;
@Directive({
  selector: '[appCesium]',
})
export class CesiumDirective implements OnInit {
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private el: ElementRef,
    private MS: MessageService,
    private FS: FunctionService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    // Put initialization code for the Cesium viewer here
    this.MS.viewer = new Cesium.Viewer(this.el.nativeElement, {
      //sceneMode : Cesium.SceneMode.COLUMBUS_VIEW,

      baseLayerPicker: false,
      geocoder: false,
      timeline: false,
      animation: false,
      vrButton: false,
      shadows: false,

      imageryProvider: new Cesium.TileMapServiceImageryProvider({
        url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII'),
      }),
    });
    const key = 'mREEYXYPf3myy2CMlFhY'; //YOUR_MAPTILER_API_KEY_HERE
    let ifConnected = window.navigator.onLine;
    if (ifConnected) {
      const imageryProvider = new Cesium.UrlTemplateImageryProvider({
        //url: `https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=${key}`,
        url: `https://api.maptiler.com/maps/hybrid/256/{z}/{x}/{y}.jpg?key=mREEYXYPf3myy2CMlFhY`,
        minimumLevel: 0,
        maximumLevel: 20,
        credit: new Cesium.Credit(
          '\u003ca href="https://www.maptiler.com/copyright/" target="_blank"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href="https://www.openstreetmap.org/copyright" target="_blank"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e',
          true
        ),
      });
      this.MS.viewer.imageryLayers.addImageryProvider(imageryProvider);

      /*const terrainProvider = new Cesium.CesiumTerrainProvider({
        url: `https://api.maptiler.com/tiles/terrain-quantized-mesh-v2/?key=${key}`,
        credit: new Cesium.Credit(
          '\u003ca href="https://www.maptiler.com/copyright/" target="_blank"\u003e\u0026copy;MapTiler\u003c/a\u003e \u003ca href="https://www.openstreetmap.org/copyright" target="_blank"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e',
          true
        ),
        requestVertexNormals: true,
      });
      this.MS.viewer.terrainProvider = terrainProvider;*/
    }
    this.MS.viewer.scene.globe.depthTestAgainstTerrain = true;
    this.MS.viewer.scene.globe.enableLighting = true;
    this.MS.viewer.scene.globe.dynamicAtmosphereLighting = true;

    const options: any = {};
    options.defaultResetView = new Cesium.Cartographic(
      Cesium.Math.toRadians(18.5163),
      Cesium.Math.toRadians(4.3313),
      1000000
    );
    options.orientation = {
      heading: Cesium.Math.toRadians(360),
      pitch: Cesium.Math.toRadians(-90),
      roll: Cesium.Math.toRadians(360),
    };
    options.duration = 4;
    options.enableCompass = true;
    options.enableZoomControls = true;
    options.enableDistanceLegend = true;
    options.enableCompassOuterRing = true;
    options.resetTooltip = 'Reset Navigation';
    options.zoomInTooltip = 'Zoom In';
    options.zoomOutTooltip = 'Zoom Out';
    new CesiumNavigation(this.MS.viewer, options);

    let scope = this;
    this.MS.viewer.screenSpaceEventHandler.setInputAction(function (
      click: any
    ) {
      var pickedObject = scope.MS.viewer.scene.pick(click.position);
      if (Cesium.defined(pickedObject)) {
        var entity = pickedObject.id;
        if (entity.name == 'Location') {
          let id = entity._id;
          scope.MS.selectedLocation = scope.MS.locations.find(
            (location: any) => location.id === id
          );
          scope.FS.getVideos(scope.MS.selectedLocation.id);
          scope.FS.gotoSelectedLocation();
        }
      }
    },
    Cesium.ScreenSpaceEventType.LEFT_CLICK);

    this.getLocations();
  }

  getLocations() {
    this.apiService
      .getLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        console.log(res);
        this.MS.locations = res;
        this.showLocations();
        this.getUserLocation();
      });
  }

  showLocations() {
    for (var i = 0; i < this.MS.locations.length; i++) {
      var point = this.MS.locations[i];
      var id = point.id;
      var latitude = point.latitude;
      var longitude = point.longitude;
      var city_name = point.city_name;
      var country_name = point.country_name;

      this.MS.viewer.entities.add({
        id: id,
        name: 'Location',
        position: Cesium.Cartesian3.fromDegrees(longitude, latitude, 100),
        point: {
          pixelSize: 6,
          color: Cesium.Color.fromCssColorString('#00FF64'),
          //outlineWidth: 1,
          //outlineColor: Cesium.Color.WHITE,
        },
      });
    }
  }

  getUserLocation() {
    if (navigator.geolocation) {
      let scope = this;
      navigator.geolocation.getCurrentPosition(function (position) {
        //scope.MS.userlocation.lat = position.coords.latitude;
        //scope.MS.userlocation.lng = position.coords.longitude;
        scope.MS.userLocation.lat = 2.3313;
        scope.MS.userLocation.lng = 16.5163;

        scope.MS.selectedLocation = scope.searchNearbyLocation()[0];
        scope.FS.getVideos(scope.MS.selectedLocation.id);
        scope.FS.gotoSelectedLocation();
      });
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }

  searchNearbyLocation() {
    let numberOfLocations = 1;
    const userPosition = Cesium.Cartesian3.fromDegrees(
      this.MS.userLocation.lng,
      this.MS.userLocation.lat
    );

    this.MS.locations.forEach((location: any) => {
      location.position = Cesium.Cartesian3.fromDegrees(
        location.longitude,
        location.latitude
      );
      location.distance = Cesium.Cartesian3.distance(
        location.position,
        userPosition
      );
    });
    this.MS.locations.sort((a: any, b: any) => a.distance - b.distance);
    return this.MS.locations.slice(0, numberOfLocations);
  }
}
