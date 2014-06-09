'use strict';

angular.module('bitFTPApp.directives', [])

.directive('appVersion', ['version', function(version) {
  return function(scope, elm, attrs) {
    elm.text(version);
  };
}])

.directive('directoryChooser', [function() {
  return {
    restrict: 'E',
    require: 'ngModel',
    scope: {
        directoryModel: '=ngModel'
    },
    templateUrl: 'partials/directives/directoryChooser.html',
    link: function(scope, elm, attrs, ngModel) {

      elm.find('span.input-group-btn').on('click', function() {
        elm.find('input[type="file"]').click();
      });

      elm.find('input[type="file"]').on('change', function() {
        elm.find('input#startDirectory').val($(this).val());
        ngModel.$setViewValue($(this).val());
      });

    }
  }
}])

.directive('passwordShow', [function() {
  return {
    restrict: 'E',
    scope: {
      passwordModel: '=ngModel',
      passwordDisabled: '=ngDisabled'
    },
    templateUrl: 'partials/directives/passwordShow.html',
    link: function(scope, elm) {
      elm.find('button').on('mousedown', function() {
        elm.find('input').attr('type', 'text');
      });
      elm.find('button').on('mouseup', function() {
        elm.find('input').attr('type', 'password');
      });
    }
  }
}])

.directive('uint', [function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, elm, attrs, ngModel) {
      elm.on('blur', function() {
        var v = 0;
        if(parseInt(elm.val()))
          v = parseInt(Math.abs(elm.val()));
        elm.val(v);
        ngModel.$setViewValue(v);
      });
    }
  }
}])

.directive('acBoxfill', [function() {
  return {
    restrict: 'A',
    link: function(scope, elm) {
      
      function createSVGEl() {
        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttributeNS(null, 'viewBox', '0 0 100 100');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        return svg;
      }

      function controlCheckbox( el ) {
        var svg = createSVGEl();
        el.parentNode.appendChild(svg);

        scope.$watch(angular.element(el).data('$ngModelController').$modelValue, function() {
          if(angular.element(el).data('$ngModelController').$modelValue == true)
            draw(el, "add");
          else
            draw(el, "remove");
        });

        el.addEventListener('change', function() {
          if(el.checked)
            draw(el, "add");
          else
            draw(el, "remove");
        });
      }

      function draw(el, id) {
        var pathDef = 'M6.987,4.774c15.308,2.213,30.731,1.398,46.101,1.398 c9.74,0,19.484,0.084,29.225,0.001c2.152-0.018,4.358-0.626,6.229,1.201c-5.443,1.284-10.857,2.58-16.398,2.524 c-9.586-0.096-18.983,2.331-28.597,2.326c-7.43-0.003-14.988-0.423-22.364,1.041c-4.099,0.811-7.216,3.958-10.759,6.81 c8.981-0.104,17.952,1.972,26.97,1.94c8.365-0.029,16.557-1.168,24.872-1.847c2.436-0.2,24.209-4.854,24.632,2.223 c-14.265,5.396-29.483,0.959-43.871,0.525c-12.163-0.368-24.866,2.739-36.677,6.863c14.93,4.236,30.265,2.061,45.365,2.425 c7.82,0.187,15.486,1.928,23.337,1.903c2.602-0.008,6.644-0.984,9,0.468c-2.584,1.794-8.164,0.984-10.809,1.165 c-13.329,0.899-26.632,2.315-39.939,3.953c-6.761,0.834-13.413,0.95-20.204,0.938c-1.429-0.001-2.938-0.155-4.142,0.436 c5.065,4.68,15.128,2.853,20.742,2.904c11.342,0.104,22.689-0.081,34.035-0.081c9.067,0,20.104-2.412,29.014,0.643 c-4.061,4.239-12.383,3.389-17.056,4.292c-11.054,2.132-21.575,5.041-32.725,5.289c-5.591,0.124-11.278,1.001-16.824,2.088 c-4.515,0.885-9.461,0.823-13.881,2.301c2.302,3.186,7.315,2.59,10.13,2.694c15.753,0.588,31.413-0.231,47.097-2.172 c7.904-0.979,15.06,1.748,22.549,4.877c-12.278,4.992-25.996,4.737-38.58,5.989c-8.467,0.839-16.773,1.041-25.267,0.984 c-4.727-0.031-10.214-0.851-14.782,1.551c12.157,4.923,26.295,2.283,38.739,2.182c7.176-0.06,14.323,1.151,21.326,3.07 c-2.391,2.98-7.512,3.388-10.368,4.143c-8.208,2.165-16.487,3.686-24.71,5.709c-6.854,1.685-13.604,3.616-20.507,4.714 c-1.707,0.273-3.337,0.483-4.923,1.366c2.023,0.749,3.73,0.558,5.95,0.597c9.749,0.165,19.555,0.31,29.304-0.027 c15.334-0.528,30.422-4.721,45.782-4.653',
            animDef = { speed : .5, easing : 'ease-in' },
            svg = el.parentNode.querySelector( 'svg' );
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path' );
        svg.appendChild( path );
        path.setAttributeNS(null, 'd', pathDef);
        path.setAttributeNS(null, 'id', id);
        var length = path.getTotalLength();
        path.style.strokeDasharray = length + ' ' + length;
        path.style.strokeDashoffset = Math.floor(length) - 1;
        path.getBoundingClientRect();
        path.style.transition = path.style.WebkitTransition = path.style.MozTransition  = 'stroke-dashoffset ' + animDef.speed + 's ' + animDef.easing + ' ' + 0 + 's';
        path.style.strokeDashoffset = '0';
      }

      var checkbxsBoxfill = Array.prototype.slice.call(elm.find('input[type="checkbox"]'));
      checkbxsBoxfill.forEach(function(el) { controlCheckbox(el); });

    }
  }
}])

.directive('ngDataHint', [function() {
  return {
    restrict: 'A',
    link: function(scope, elm, attr) {
      scope.$watch(attr['ngDataHint'], function(newVal) {
        for(var i in newVal) {
          elm.attr('data-hint', (newVal[i]) ? i : null);
          break;
        }
      }, true);
    }
  }
}]);