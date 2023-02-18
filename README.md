# Motherlandglobal

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

…or create a new repository on the command line
echo "# motherlandglobal" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/chiliblast/motherlandglobal.git
git push -u origin main

…or push an existing repository from the command line
git remote add origin https://github.com/chiliblast/motherlandglobal.git
git branch -M main
git push -u origin main

Fiverr Project

As indicated to the seller,
I would like to create a site for consulting with creatives uploading to social media platforms
(Specifically begining withthe continent of Africa) to link their videos globally
from the designated destination city/country/countinent source on the map.
This may resemble radio.garden platform as proof of concept.

Replicate http://www.radio.garden/settings/radio-garden

Domain motherlandglobal.social

---

1st milestone: Setup environment
Setup client side Angular framework based environment with bootstrap, typescript to work with CesiumJS.

2nd milestone: Imagery using MapTiler
Develop a 3D globe using CesiumJS with Satellite imagery using MapTiler

3rd milestone: Server Setup
setup myphp sql server environment. create database for the project that will store the video links, with locations, city name, country name. add some data for Africa, also cerate user table that will store user credentials and his favourite videos.

4th milestone: Mark Locations
Place dots on globe after getting location data from database server. camera view will automatically go over user location, and find a nearby video location to place marker over it. (But as we have currently Africa data, camera will be fixed to a particular location in Africa)

5th milestone: Video Player
develop a user interface to show a video player. user would be able to play pause video. user will also be able to click a a dot location on map, and camera will get centre of it, and video data will be loaded for that location to play relevant video

6th milestone: User Interface
develop a user interface for user signup account and signing using his credentials. after signing, user can search any video from database across the globe, mark favourite video, list favourite videos, according to user

---

Run node server:
motherlandglobal> node .\server.js

Run angular client:
motherlandglobal\client> ng serve
