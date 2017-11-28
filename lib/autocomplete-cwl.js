module.exports = {
  provider: null,

  activate() {},

  deactivate() {
    this.provider = null
  },

  provide() {
    if (this.provider == null) {
      const CWLProvider = require('./cwl-provider')
      this.provider = new CWLProvider()
      if (this.cwls != null) {
        this.provider.setcwlsSource(this.cwls)
      }
    }

    return this.provider
  },

  consumecwls(cwls) {
    this.cwls = cwls
    return (this.provider != null ? this.provider.setcwlsSource(this.cwls) : undefined)
  }
}
