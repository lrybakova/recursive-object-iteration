<script src="/simpletest.js"></script>
<script>
  (function () {

    libraryStorage = {}

    function librarySystem(libraryName, dependencies, callback) {
      if (arguments.length > 1) {
        libraryStorage[libraryName] = {
          callback,
          dependencies,
          data: null,
        }

      } else {

        let dependencies = libraryStorage[libraryName]['dependencies'];
        let callback = libraryStorage[libraryName]['callback'];
        let callbackArguments;
        
        if (libraryStorage[libraryName]['data'] === null) {
          callbackArguments = dependencies.map(function (dep) {
            return librarySystem(dep);
          });
          libraryStorage[libraryName]['data'] = callback(...callbackArguments);
        }
        return libraryStorage[libraryName]['data'];
      }
    }

    window.librarySystem = librarySystem;
  })()

  tests({

    'It should accept dependencies from array': function () {
      librarySystem('name', [], function () {
        return 'Mila';
      });

      librarySystem('surname', [], function () {
        return 'Ronkko';
      });

      librarySystem('fullName', ['name', 'surname'], function (name, surname) {
        return name + ' ' + surname;
      });

      let result = librarySystem('fullName')

      eq(result, 'Mila Ronkko')
    },


    'It should work even if lib is created before its dependencies': function () {
      librarySystem('workBlurb', ['name', 'company'], function (name, company) {
        return name + ' works at ' + company;
      });

      librarySystem('name', [], function () {
        return 'Mila';
      });

      librarySystem('company', [], function () {
        return 'Google';
      });

      librarySystem('workBlurb')

      let result = librarySystem('workBlurb')
      eq(result, 'Mila works at Google')
    },

    'It should run the callback for each of the libs only once': function () {

      let counterForName = 0;
      let counterForSurname = 0;
      let counterForFullName = 0;
      let counterForCompany = 0;
      let counterForWorkBlurb = 0;
      librarySystem('workBlurb', ['name', 'company'], function (name, company) {
        counterForWorkBlurb++;
        return name + ' works at ' + company;
      });

      librarySystem('name', [], function () {
        counterForName++;
        return 'Mila';
      });


      librarySystem('company', [], function () {
        counterForCompany++;
        return 'Google';
      });

      let extraMention = librarySystem('workBlurb');
      let extraMention2 = librarySystem('workBlurb');

      eq(counterForWorkBlurb, 1);
      eq(counterForName, 1);
      eq(counterForCompany, 1);
    },

    'It should work with unlimited number of dependencies levels': function () {
      librarySystem('workBlurb', ['fullName', 'company'], function (fullName, company) {
        return fullName + ' works at ' + company
      });

      librarySystem('fullName', ['name', 'surname'], function (name, surname) {
        return name + ' ' + surname
      });

      librarySystem('name', [], function () {
        return 'Mila'
      });

      librarySystem('surname', [], function () {
        return 'Ronkko'
      });

      librarySystem('company', [], function () {
        return 'Google'
      });

      let result = librarySystem('workBlurb');
      eq(result, 'Mila Ronkko works at Google')
    },
  })
</script>
