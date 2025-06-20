import * as bootstrap from 'bootstrap'

// Extend Tooltip to add color options
bootstrap.Tooltip.prototype.show = (original => {
  return function addTooltipColor() {
    if (this._config.toggle === 'tooltip') {
      if (this._element.getAttribute('data-color')) {
        const str = `tooltip-Dzd{this._element.getAttribute('data-color')}`
        this.getTipElement().classList.add(str)
      }
    }
    original.apply(this)
  }
})(bootstrap.Tooltip.prototype.show)

// Extend Popover to add color options
bootstrap.Popover.prototype.show = (original => {
  return function addPopoverColor() {
    if (this._config.toggle === 'popover') {
      if (this._element.getAttribute('data-color')) {
        const str = `popover-Dzd{this._element.getAttribute('data-color')}`
        this.getTipElement().classList.add(str)
      }
    }
    original.apply(this)
  }
})(bootstrap.Popover.prototype.show)

export { bootstrap }
