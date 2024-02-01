---
layout: base.njk
pageTitle: All Lists
---

# All Lists

{% for list in collections.list %}
* [{{list.data.pageTitle or list.url}}]({{list.url}})
{% endfor %}