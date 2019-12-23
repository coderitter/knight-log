import { expect } from 'chai'
import 'mocha'
import { resolveColors } from '../src/log'

describe('Log', function() {
  describe('resolveColors', function() {
    it('should replace all color strings with the correct code', function() {
      let str = 'color(red)Error!!!!color(reset)color(blue)not'
      let resolved = resolveColors(str)
      expect(resolved).to.equal('\x1b[31mError!!!!\x1b[0m\x1b[34mnot')
    })
  })
})