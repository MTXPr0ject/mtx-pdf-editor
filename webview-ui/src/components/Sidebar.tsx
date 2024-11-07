import React from 'react';
import * as Tabs from "@radix-ui/react-tabs";
import { Thumbnails } from "./Thumbnails";
import { Properties } from "./Properties";

export const Sidebar: React.FC = () => {
  return (
    <Tabs.Root className="sidebar" defaultValue="thumbnails">
      <Tabs.List className="tabs-list">
        <Tabs.Trigger value="thumbnails">Thumbnails</Tabs.Trigger>
        <Tabs.Trigger value="properties">Properties</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="thumbnails">
        <Thumbnails />
      </Tabs.Content>

      <Tabs.Content value="properties">
        <Properties />
      </Tabs.Content>
    </Tabs.Root>
  );
};
