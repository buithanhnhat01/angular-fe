var app = angular.module("myApp", ["ngRoute"]);

app.config(function ($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "home.html",
    })
    .when("/subjects", {
      templateUrl: "subjects.html",
      controller: "subjectsCtrl",
    })
    .when("/gioithieu", {
      templateUrl: "gioithieu.html",
    })
    .when("/infor", {
      templateUrl: "infor.html",
    })
    .when("/lienhe", {
      templateUrl: "lienhe.html",
    })
    .when("/gopy", {
      templateUrl: "gop_y.html",
    })
    .when("/hoidap", {
      templateUrl: "hoidap.html",
    })
    .when("/dangki", {
      templateUrl: "dangki.html",
    })
    .when("/dangnhap", {
      templateUrl: "dangnhap.html",
    })
    .when("/doimk", {
      templateUrl: "doiMK.html",
    })
    .when("/quenmk", {
      templateUrl: "quenMK.html",
    })
    .when("/read", {
      templateUrl: "readfile.html",
    })
    .when("/quiz/:id/:name", {
      templateUrl: "quiz-app.html",
      controller: "quizCtrl",
    });
});
app.controller("subjectsCtrl", function ($scope, $http) {
  $scope.list_subject = [];
  $http.get("../db/Subjects.js").then(function (res) {
    $scope.list_subject = res.data;
  });
});
app.controller("quizCtrl", function ($scope, $http, $routeParams, quizFactory) {
  $http.get("../db/Quizs/" + $routeParams.id + ".js").then(function (res) {
    quizFactory.questions = res.data;
  });
});

app.directive("quizpoly", function (quizFactory, $routeParams) {
  return {
    restrict: "AE",
    scope: {},
    templateUrl: "template-quiz.html",
    link: function (scope, elem, attrs) {
      scope.start = function () {
        quizFactory.getQuestions().then(function () {
          scope.subjectName = $routeParams.name;
          scope.subjectLogo = $routeParams.logo;
          scope.id = 1; 
          scope.inProgess = true;
          scope.getQuestion();
          scope.quizOver = false; //Chua xong Quiz
        });
        //Time code 
    
      };
      scope.reset = function () {
        scope.inProgess = false;
        scope.score = 0;
      };
      scope.getQuestion = function () {
        var quiz = quizFactory.getQuestion(scope.id);
        if (quiz) {
          scope.question = quiz.Text;
          scope.options = quiz.Answers;
          scope.answer = quiz.AnswerId;
          scope.answerMode = true;
        } else {
          scope.quizOver = true;
        }
      };

      scope.checkAnswer = function () {
        // alert('Answer')
        if (!$("input[name = answer]:checked").length) return;
        var ans = $("input[name = answer]:checked").val();
        if (ans == scope.answer) {
          //alert('Chúc mừng, Bạn đã trả lời ĐÚNG !');
          scope.score++;
          scope.correcAnswers = true;
        } else {
          //alert('Thật tiếc, Bạn đã trả lờI SAI !');
          scope.correcAnswers = false;
        }
        scope.answerMode = false;
      };
      scope.nextQuestion = function () {
        scope.id++;
        scope.getQuestion();
      };
      scope.prevQuestion = function () {
        scope.id--;
        scope.getQuestion();
      };
      scope.reset();
    },
  };
});
app.controller("studentCtrl", function ($scope, $http) {
  //Hiển thị thông tin tất cả sinh viên
  $scope.list_student = [];
  $http.get("db/Students.js").then(function (reponse) {
    $scope.list_student = reponse.data;
  });
});
app.controller(
  "loginCtrl",
  function ($scope, $http, $location, $rootScope, $window) {
    $http.get("../db/Students.js").then(function (response) {
      $scope.students = response.data;
      if ($window.sessionStorage.getItem("account") == null) {
        $window.sessionStorage.setItem(
          "account",
          JSON.stringify($scope.students)
        );
      }
      var acc = JSON.parse($window.sessionStorage.getItem("account"));
      $scope.login = function () {
        for (var i = 0; i < acc.length; i++) {
          if (
            acc[i].username == $scope.username &&
            acc[i].password == $scope.password
          ) {
            $location.path("/");
            $rootScope.username = acc[i].username;
            $rootScope.password = acc[i].password;
            $rootScope.fullname = acc[i].fullname;
            $rootScope.email = acc[i].email;
            $rootScope.birthday = acc[i].birthday;
            $rootScope.gender = acc[i].gender;
            $rootScope.schoolfee = acc[i].schoolfee;

            //lay Thong tin
            $window.sessionStorage.setItem(
              "username",
              JSON.stringify($rootScope.username)
            );
            $window.sessionStorage.setItem(
              "password",
              JSON.stringify($rootScope.password)
            );
            $window.sessionStorage.setItem(
              "fullname",
              JSON.stringify($rootScope.fullname)
            );
            $window.sessionStorage.setItem(
              "email",
              JSON.stringify($rootScope.email)
            );
            $window.sessionStorage.setItem(
              "schoolfee",
              JSON.stringify($rootScope.schoolfee)
            );
            $window.sessionStorage.setItem(
              "birthday",
              JSON.stringify($rootScope.birthday)
            );
            $window.sessionStorage.setItem(
              "gender",
              JSON.stringify($rootScope.gender)
            );
            //----------------------------------------------------------------
            $rootScope.success = true;
            location.href = "index.html";
            console.log($rootScope.username);
            break;
          }
        }
        if (!$rootScope.success) {
          $rootScope.status = "Đăng nhập thất bại! Hãy kiểm tra thông tin nhé!";
        }
      };

      $scope.account = "";
      $scope.index = -1;
      if (sessionStorage.getItem("username") !== null) {
        $scope.account = JSON.parse(sessionStorage.getItem("username"));
        $scope.index = $scope.account.length - 1;
      }
      // Logout
      $scope.logout = function () {
        $rootScope.success = false;
        window.sessionStorage.clear();
        window.localStorage.clear();
        location.href = "index.html";
      };
      // Get infor
      $rootScope.usernamer = JSON.parse(sessionStorage.getItem("username"));
      $rootScope.passwordr = JSON.parse(sessionStorage.getItem("password"));
      $rootScope.fullnamer = JSON.parse(sessionStorage.getItem("fullname"));
      $rootScope.emailr = JSON.parse(sessionStorage.getItem("email"));
      $rootScope.schoolfeer = JSON.parse(sessionStorage.getItem("schoolfee"));
      $rootScope.birthdayr = JSON.parse(sessionStorage.getItem("birthday"));
      $rootScope.genderr = JSON.parse(sessionStorage.getItem("gender"));
    });
  }
);

app.factory("quizFactory", function ($http, $routeParams) {
  //alert(questions.length);
  return {
    getQuestions: function () {
      return $http
        .get("../db/Quizs/" + $routeParams.id + ".js")
        .then(function (res) {
          questions = res.data;
        });
    },

    getQuestion: function (id) {
      var randomItem = questions[Math.floor(Math.random() * questions.length)];
      var count = questions.length;
      if (count > 10) {
        count = 10;
      }
      if (id < count) {
        return randomItem;
      } else {
        return false;
      }
    },
  };
});
//timecode

window.onload = function () {
  var hour = 09;
  var sec = 59;
  setInterval(function () {
      document.getElementById("timer").innerHTML = hour + ":" + sec;
      sec--;
      if (sec == 00) {
          hour--;
          sec = 60;
          if (hour == 00) {
              document.getElementById("timerend").innerHTML = "Hết Thời Gian !";
          }
      }
  }, 1000);
};

