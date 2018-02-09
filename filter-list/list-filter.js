angular.module("myapp", [])
    .controller("HelloController", function($scope, $q, $http) {
        var vm = this;
        vm.response = {};
        vm.searchResults = [];
        vm.name = "";
        vm.location = "";
        vm.ascPercentageFunded = false;
        vm.show = false;
        vm.ascEndTime = false;
        vm.descPercentageFunded = false;
        vm.descEndTime = false;
        vm.filterLog = [];

        $http.get("http://starlord.hackerearth.com/kickstarter")
            .then(function(response) {
                vm.response = response.data;
                vm.showList = vm.response;
                vm.showListCopy = vm.response;
                vm.filterLog = JSON.parse(localStorage.getItem('filterLog'));
                if(vm.filterLog == null){
        			localStorage.setItem("filterLog", JSON.stringify([]));
        			vm.filterLog = [];
                } 
                vm.normaliseSort();
            });

        vm.populateSearchAutofill = function() {
            angular.element(document.querySelector('.search-container')).css('display', 'block');
            vm.searchResults = [];
            for (var i in vm.response) {
                if (vm.response[i].title.toLowerCase().includes(vm.search.toLowerCase())) {
                    vm.searchResults.push(vm.response[i]);
                }
            }
        }

        vm.filterList = function() {
            vm.search = "";
            if (vm.name.replace(/ /g, '') === "" && vm.location.replace(/ /g, '') === "") {
                vm.showList = vm.response;
            } else if (vm.name.replace(/ /g, '') !== "" && vm.location.replace(/ /g, '') === "") {
                vm.showList = vm.response.filter(function(item) {
                    if (item.title.toLowerCase().includes(vm.name.toLowerCase())) {
                        return 1;
                    } else return 0;
                })
            } else if (vm.name.replace(/ /g, '') === "" && vm.location.replace(/ /g, '') !== "") {
                vm.showList = vm.response.filter(function(item) {
                    if (item.location.toLowerCase().includes(vm.location.toLowerCase())) {
                        return 1;
                    } else return 0;
                })
            } else if (vm.name.replace(/ /g, '') !== "" && vm.location.replace(/ /g, '') !== "") {
                vm.showList = vm.response.filter(function(item) {
                    if (item.title.toLowerCase().includes(vm.name.toLowerCase()) && item.location.toLowerCase().includes(vm.location.toLowerCase())) {
                        return 1;
                    } else return 0;
                })
            }

            var criteria = '',
                asc = false;

            if (!vm.ascPercentageFunded &&
                !vm.descPercentageFunded &&
                !vm.ascEndTime &&
                !vm.descEndTime) {
                vm.normaliseSort();
            } else {

                if (vm.ascPercentageFunded) {
                    criteria = 'percentage.funded';
                    asc = true;
                } else if (vm.descPercentageFunded) {
                    criteria = 'percentage.funded';
                    asc = false;
                } else if (vm.ascEndTime) {
                    criteria = 'end.time';
                    asc = true;
                } else if (vm.descEndTime) {
                    criteria = 'end.time';
                    asc = false;
                }
                if (asc) {
                    vm.showList.sort(function(a, b) {
                        if (a[criteria] > b[criteria]) {
                            return 1;
                        }
                        if (a[criteria] < b[criteria]) {
                            return -1;
                        }
                        return 0;
                    });
                } else {
                    vm.showList.sort(function(a, b) {
                        if (a[criteria] > b[criteria]) {
                            return -1;
                        }
                        if (a[criteria] < b[criteria]) {
                            return 1;
                        }
                        return 0;
                    });
                }
            }

            var log = {
                'nameFilter': vm.name,
                'locationFilter': vm.location,
                'sort': {
                    'criteria': criteria,
                    'order': asc ? 'Asc.' : 'Desc.'
                }
            };
            vm.filterLog = JSON.parse(localStorage.getItem('filterLog'));
            vm.filterLog[vm.filterLog.length] = log;
            localStorage.setItem('filterLog', JSON.stringify(vm.filterLog));
        }

        vm.normaliseSort = function() {
            vm.showList.sort(function(a, b) {
                if (a['s.no'] > b['s.no']) {
                    return -1;
                }
                if (a['s.no'] < b['s.no']) {
                    return 1;
                }
                return 0;
            });
        }

        vm.setSortParams = function(param) {
        	// vm.show=!vm.show
            if (param == 1) {
                vm.ascPercentageFunded = vm.ascPercentageFunded ? false : true;
                vm.descPercentageFunded = false;
                vm.ascEndTime = false;
                vm.descEndTime = false;
            } else if (param == 2) {
                vm.ascPercentageFunded = false;
                vm.descPercentageFunded = vm.descPercentageFunded ? false : true;
                vm.ascEndTime = false;
                vm.descEndTime = false;
            } else if (param == 3) {
                vm.ascPercentageFunded = false;
                vm.descPercentageFunded = false;
                vm.ascEndTime = vm.ascEndTime ? false : true;
                vm.descEndTime = false;
            } else {
                vm.ascPercentageFunded = false;
                vm.descPercentageFunded = false;
                vm.ascEndTime = false;
                vm.descEndTime = vm.descEndTime ? false : true;
            }

        }

        vm.clearFilter = function() {
            vm.showList = vm.response;
            vm.name = "";
            vm.location = "";
            vm.ascPercentageFunded = false;
            vm.descPercentageFunded = false;
            vm.ascEndTime = false;
            vm.descEndTime = false;
        }

        vm.getDate = function(date) {
            var theDate = new Date(date);
            dateString = theDate.toGMTString();
            return (dateString);
        }

        vm.showSelected = function(entry) {
            vm.search = entry.title;
            angular.element(document.querySelector('.search-container')).css('display', 'none');
            vm.showListCopy = vm.showList;
            vm.name = "";
            vm.location = "";
            vm.ascPercentageFunded = false;
            vm.ascEndTime = false;
            vm.descPercentageFunded = false;
            vm.descEndTime = false;
            vm.showList = vm.response;
            vm.showList = vm.response.filter(function(item) {
                if (item.title.toLowerCase().includes(vm.search.toLowerCase())) {
                    return 1;
                } else return 0;
            })
        }

        vm.clearSearch = function() {
            vm.showList = vm.showListCopy;
            vm.search = "";
        }

        vm.hideSearch = function() {
            angular.element(document.querySelector('.search-container')).css('display', 'none');
            vm.show = false;
        }

        vm.protectedNull = function(item) {
            if (item === '') return '--';
            else return item;
        }


    });
