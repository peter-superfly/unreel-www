import React, { Fragment, useEffect, useState } from "react";
import { NotionRenderer } from "react-notion-x";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const Code = dynamic(() =>
  import('react-notion-x/build/third-party/code').then(async (m) => {
    // additional prism syntaxes
    await Promise.all([
      import('prismjs/components/prism-bash.js'),
      import('prismjs/components/prism-c.js'),
      import('prismjs/components/prism-docker.js'),
      import('prismjs/components/prism-java.js'),
      import('prismjs/components/prism-js-templates.js'),
      import('prismjs/components/prism-git.js'),
      import('prismjs/components/prism-graphql.js'),
      import('prismjs/components/prism-python.js'),
      import('prismjs/components/prism-sql.js'),
      import('prismjs/components/prism-yaml.js')
    ])
    return m.Code
  })
)
const Collection = dynamic(() =>
  import("react-notion-x/build/third-party/collection").then(
    (m) => m.Collection
  )
);
const Equation = dynamic(() =>
  import("react-notion-x/build/third-party/equation").then((m) => m.Equation)
);
const Pdf = dynamic(
  () => import("react-notion-x/build/third-party/pdf").then((m) => m.Pdf),
  {
    ssr: false,
  }
);
const Modal = dynamic(
  () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
  {
    ssr: false,
  }
);

function NotionBody(props) {
  const router = useRouter();
  const { block_id } = router.query;
  const { pages } = props;
  const [mode, setMode] = useState(
    typeof window == !"undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  );

  useEffect(() => {
    const modeMe = (e) => {
      setMode(e.matches ? "dark" : "light");
    };
    setMode(
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
    );
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", modeMe);
    return window
      .matchMedia("(prefers-color-scheme: dark)")
      .removeListener(modeMe);
  }, []);

  return (
    <Fragment>
      <div className={"notion-body"}>
        <NotionRenderer
          recordMap={pages}
          fullPage={true}
          darkMode={mode === "dark"}
          components={{
            Code,
            Collection,
            Equation,
            Modal,
            Pdf,
            nextLink: Link,
          }}
        />
      </div>
    </Fragment>
  );
}

export default NotionBody;
