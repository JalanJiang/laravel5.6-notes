module.exports = {
  hooks: {
    "page:before": function (page) {
      var show = 
        page.pageinfo !== false;

      if (show) {
        var prefix = "";

        prefix += "# {{ page.title }}\n\n";
        prefix += "{{ page.description }}\n\n";
        prefix += "---\n\n";

        page.content = prefix + page.content;
      }

      return page;
    }
  }
};

