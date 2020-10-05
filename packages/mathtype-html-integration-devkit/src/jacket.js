/**
* A module representing a jacket.
* @module my/jacket
*/
define('my/jacket', () => {
  /**
     * Create a new jacket.
     * @class
     * @alias module:my/jacket
     */
  const Jacket = function () {
    console.log('1');
  };

  /** Zip up the jacket. */
  Jacket.prototype.zip = function () {
    console.log('2');
  };

  return Jacket;
});