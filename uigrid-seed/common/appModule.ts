import * as angular from "angular";
import * as uigrid from "angular-ui-grid";

uigrid;

export const appModule = angular.module("myApp", [
    "ui.grid",
    "ui.grid.edit",
    //"ui.grid.resizeColumns"
]);
