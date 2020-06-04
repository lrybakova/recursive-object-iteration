<script src="/simpletest.js"></script>
<script>
  
  (function () {
  
  libraryStorage = {}

function librarySystem(libraryName, dependencies, callback){
  if (arguments.length > 1) {

    libraryStorage[libraryName] = {
      app: callback,
      callback: callback,
      dependencies: dependencies
    }
  
  } else {

    let argsArray = [];
    
    let loadDependencies = function (libraryName) {
      dependencies = libraryStorage[libraryName]['dependencies']
      //basic case - lib has no dependencies
      if (dependencies.length === 0){
        //if lib's callback hasn't yet been called we need to run it once and save the result
        if (typeof libraryStorage[libraryName]['app'] === 'function') {
          let callbackResult = libraryStorage[libraryName]['app']();
          libraryStorage[libraryName]['app'] = callbackResult;
          callbackResult//?
          return callbackResult;
          
        } else { // if lib has been already used we have it's result and can return it immediately 
          return libraryStorage[libraryName]['app']
        }
      } else {
        //If lib has dependencies we recursively collect it from object and store values into array  
        let libDependencies = libraryStorage[libraryName]['dependencies'];
        return libDependencies.map(function(dep){
          return argsArray.push(loadDependencies(dep))
        })
      }
    }
    loadDependencies(libraryName)
    // and now we can run the library using the dependencies returns as arguments
    let allDepsLoaded = libraryStorage[libraryName]['callback'](...argsArray)
      return allDepsLoaded
     }
     
}

window.librarySystem = librarySystem


})(window)

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

      eq(counterForWorkBlurb, 1);
      eq(counterForName, 1);
      eq(counterForCompany, 1);
    }
  })
</script>
