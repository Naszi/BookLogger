(function () {

    angular.module('app')
        .factory('bookLoggerInterceptor', ['$q', '$log', bookLoggerInterceptor]);

    function bookLoggerInterceptor($q, $log) {

        return {
            request: requestInterceptor,
            responseError: responseErrorInterceptor

            // még nincs implementálva
            // requestError
            // response
        };

        function requestInterceptor(config) {
            return config;

        }

        function responseErrorInterceptor(response) {
            return $q.reject(response);

        }

    }

}());