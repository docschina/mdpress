# Markdown Slot

MdPress implements a content distribution API for Markdown. With this feature, you can split your document into fragments, allowing flexible composition in the layout component.

## Why do I need Markdown Slot?

First, let’s review the relationship between layout components and Markdown files:

<DiagramMarkdownSlotRelationship/>

Markdown files are providers of metadata (Page content, Configuration, etc.), while layout components consume them. We can use `frontmatter` to define some metadata for common data types, but `frontmatter` is hard to do something about Markdown / HTML, a complex metadata that involves differences before and after compilation.

Markdown Slot is to solve this kind of problem.

## Named Slots

You can define a named Markdown slot through the following Markdown syntax:

``` md
::: slot name

:::
```

Use the `Content` component to use the slot in the layout component:

``` jsx
<Content slotKey="name"/>
```

## Default Slot Content

By default, the slot-free part of a Markdown file becomes the default content of a Markdown slot, which you can access directly using the `Content` component:

``` jsx
<Content/>
```

## Example

Suppose your layout component is as follows:

``` jsx
<div>
  <div className="container">
    <header>
      <Content slot-key="header"/>
    </header>
    <main>
      <Content/>
    </main>
    <footer>
      <Content slot-key="footer"/>
    </footer>
  </div>
</template>
```

If the Markdown content of a page is like this:

```md
::: slot header
# Here might be a page title
:::

- A Paragraph
- Another Paragraph

::: slot footer
Here's some contact info
:::
```

Then the rendered HTML of this page will be:

```html
<div class="container">
  <header>
    <div class="content header">
      <h1>Here might be a page title</h1>
    </div>
  </header>
  <main>
    <div class="content default">
      <ul>
        <li>A Paragraph</li>
        <li>Another Paragraph</li>
      </ul>
    </div>
  </main>
  <footer>
    <div class="content footer">
      <p>Here's some contact info</p>
    </div>
  </footer>
</div>
```

<!-- textlint-disable en-capitalization -->

Note that:
1. each content distribution is wrapped in a `div` whose class is `content` with the name of the slot.
2. Please ensure the uniqueness of the slot defined.

<!-- textlint-enable -->
