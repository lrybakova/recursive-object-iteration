# Recursive object iteration
- In this project I am solving challenge "Beast 4. Creating libraries out of order" form Watch and Code course. 
- The idea is to create a function, which allows to load different libraries using just one global variable. 
In order to do it, I needed to learn how to recursively iterate object's properties and pass their values to a callback function. 
- Provided tests prove that function can read the dependencies from the array, it can handle the cases when library is being created before its dependencies and that the callbacks of each function run only once.
