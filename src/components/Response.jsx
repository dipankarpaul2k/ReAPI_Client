import React from "react";

import {
  Box,
  Group,
  JsonInput,
  Tabs,
  Text,
  Title,
  Tooltip,
  ActionIcon,
  ScrollArea,
  LoadingOverlay
} from "@mantine/core";
import { useFullscreen, useElementSize } from "@mantine/hooks";
import { IconArrowsMaximize, IconArrowsMinimize } from "@tabler/icons-react";

import useStore from "../store";
import CodeSnippet from "./CodeSnippet";
import ResponseHeader from "./ResponseHeader";
import statusColors from "../utils/httpStatusColors";
import { getResponseDetails } from "../utils/helpers";

function Response() {
  const { response, loading } = useStore();

  const { ref, toggle, fullscreen } = useFullscreen();
  const { ref: responseRef, height: responseHeight } = useElementSize();

  const { size, status, time } = response
    ? getResponseDetails(response)
    : {
        size: "",
        status: "",
        time: "",
      };

  const scrollAreaMah = fullscreen ? "100vh" : 400;

  return (
    <>
      <Box my={10} mx={"auto"} pos="relative">
      <LoadingOverlay visible={loading} zIndex={10} overlayProps={{ radius: "sm", blur: 2 }} />
        <Box>
          <Group align="center" justify="space-between" my={5} px={8}>
            <Title order={3} fw={700}>
              Response
            </Title>
            <Group>
              <Text c={statusColors[status]}>Status: {status}</Text>
              <Text>Time: {time}ms</Text>
              <Text>Size: {size}</Text>
            </Group>
          </Group>

          <Tabs
            ref={ref}
            defaultValue="Response"
            variant="outline"
            radius="md"
            mah={"400px"}
            my={24}
            style={{
              overflowY: "auto",
              position: "relative",
            }}
          >
            <ScrollArea.Autosize mah={scrollAreaMah}>
              <Tabs.List
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 4,
                  backgroundColor: "var(--mantine-color-body)",
                }}
              >
                <Tabs.Tab value="Response">Response</Tabs.Tab>
                <Tabs.Tab value="Headers">Headers</Tabs.Tab>
              </Tabs.List>

              {responseHeight >= 400 && (
                <>
                  <Tooltip label="Toggle fullscreen" position="top-end">
                    <ActionIcon
                      variant="default"
                      onClick={toggle}
                      aria-label="Toggle fullscreen button"
                      style={{
                        position: "absolute",
                        zIndex: 3,
                        top: "50px",
                        right: "15px",
                      }}
                      size={30}
                    >
                      {fullscreen ? (
                        <IconArrowsMinimize size="16px" />
                      ) : (
                        <IconArrowsMaximize size="16px" />
                      )}
                    </ActionIcon>
                  </Tooltip>
                </>
              )}

              <Tabs.Panel value="Response" ref={responseRef}>
                <JsonInput
                  aria-label="Response json body..."
                  minRows={5}
                  autosize
                  readOnly
                  value={JSON.stringify(response?.data, null, 2)}
                />
              </Tabs.Panel>

              <Tabs.Panel value="Headers">
                <ResponseHeader />
              </Tabs.Panel>
            </ScrollArea.Autosize>
          </Tabs>
        </Box>
        <CodeSnippet />
      </Box>
    </>
  );
}

export default Response;
