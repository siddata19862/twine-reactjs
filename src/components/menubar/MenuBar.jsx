import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"

export default function MenuBar() {
    return (<Menubar className="border-none shadow-none">
        <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
                <MenubarItem onClick={() => navigate("/newproject")}>New Project</MenubarItem>
                {/* <MenubarItem onClick={async ()=>{await window.projectApi.open();navigate("/project")}}>Open Project</MenubarItem> */}
                <MenubarItem onClick={() => navigate("/")}>Close Project</MenubarItem>
                <MenubarItem onClick={() => navigate("/start")}>Quit Twine</MenubarItem>
            </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent>
                <MenubarItem onClick={() => navigate("/")}>Workspace</MenubarItem>
            </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
            <MenubarTrigger>Help</MenubarTrigger>
            <MenubarContent>
                <MenubarItem>About</MenubarItem>
                <MenubarItem>Licensing Information</MenubarItem>
            </MenubarContent>
        </MenubarMenu>
    </Menubar>);
}