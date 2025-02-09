import * as React from "react";
import type { Editor } from "@tiptap/react";
import type { toggleVariants } from "@/components/ui/toggle";
import type { VariantProps } from "class-variance-authority";
import { CaretDownIcon, CheckIcon } from "@radix-ui/react-icons";
import { ToolbarButton } from "../toolbar-button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "@/hooks/useTheme";

interface ColorItem {
  cssVar: string;
  label: string;
  darkLabel?: string;
}

interface ColorPalette {
  label: string;
  colors: ColorItem[];
  inverse: string;
}

const COLORS: ColorPalette[] = [
  {
    label: "Palette 1",
    inverse: "hsl(var(--background))",
    colors: [
      { cssVar: "hsl(var(--foreground))", label: "Default" },
      { cssVar: "hsl(var(--primary))", label: "Primary" },
      { cssVar: "hsl(var(--secondary))", label: "Secondary" },
      { cssVar: "hsl(var(--accent))", label: "Accent" },
      { cssVar: "hsl(var(--destructive))", label: "Destructive" },
    ],
  },
  {
    label: "Palette 2",
    inverse: "hsl(var(--background))",
    colors: [
      { cssVar: "rgb(var(--blue-600))", label: "Blue", darkLabel: "Blue" },
      { cssVar: "rgb(var(--green-600))", label: "Green", darkLabel: "Green" },
      {
        cssVar: "rgb(var(--yellow-600))",
        label: "Yellow",
        darkLabel: "Yellow",
      },
      { cssVar: "rgb(var(--red-600))", label: "Red", darkLabel: "Red" },
      {
        cssVar: "rgb(var(--purple-600))",
        label: "Purple",
        darkLabel: "Purple",
      },
    ],
  },
  {
    label: "Palette 3",
    inverse: "hsl(var(--foreground))",
    colors: [
      { cssVar: "hsl(var(--background))", label: "White", darkLabel: "Black" },
      {
        cssVar: "rgb(var(--blue-100))",
        label: "Light Blue",
        darkLabel: "Dark Blue",
      },
      {
        cssVar: "rgb(var(--green-100))",
        label: "Light Green",
        darkLabel: "Dark Green",
      },
      {
        cssVar: "rgb(var(--yellow-100))",
        label: "Light Yellow",
        darkLabel: "Dark Yellow",
      },
      {
        cssVar: "rgb(var(--red-100))",
        label: "Light Red",
        darkLabel: "Dark Red",
      },
      {
        cssVar: "rgb(var(--purple-100))",
        label: "Light Purple",
        darkLabel: "Dark Purple",
      },
    ],
  },
];

const MemoizedColorButton = React.memo<{
  color: ColorItem;
  isSelected: boolean;
  inverse: string;
  onClick: (value: string) => void;
}>(({ color, isSelected, inverse, onClick }) => {
  const { isDark } = useTheme();
  const label = isDark && color.darkLabel ? color.darkLabel : color.label;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <ToggleGroupItem
          tabIndex={0}
          className="relative size-7 rounded-md p-0"
          value={color.cssVar}
          aria-label={label}
          style={{ backgroundColor: color.cssVar }}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            onClick(color.cssVar);
          }}
        >
          {isSelected && (
            <CheckIcon
              className="absolute inset-0 m-auto size-6"
              style={{ color: inverse }}
            />
          )}
        </ToggleGroupItem>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
});

MemoizedColorButton.displayName = "MemoizedColorButton";

const MemoizedColorPicker = React.memo<{
  palette: ColorPalette;
  selectedColor: string;
  inverse: string;
  onColorChange: (value: string) => void;
}>(({ palette, selectedColor, inverse, onColorChange }) => (
  <ToggleGroup
    type="single"
    value={selectedColor}
    onValueChange={(value: string) => {
      if (value) onColorChange(value);
    }}
    className="gap-1.5"
  >
    {palette.colors.map((color, index) => (
      <MemoizedColorButton
        key={index}
        inverse={inverse}
        color={color}
        isSelected={selectedColor === color.cssVar}
        onClick={onColorChange}
      />
    ))}
  </ToggleGroup>
));

MemoizedColorPicker.displayName = "MemoizedColorPicker";

interface SectionThreeProps extends VariantProps<typeof toggleVariants> {
  editor: Editor;
}

export const SectionThree: React.FC<SectionThreeProps> = ({
  editor,
  size,
  variant,
}) => {
  const color =
    editor.getAttributes("textStyle")?.color || "hsl(var(--foreground))";
  const [selectedColor, setSelectedColor] = React.useState(color);

  const handleColorChange = React.useCallback(
    (value: string) => {
      setSelectedColor(value);
      editor.chain().setColor(value).run();
    },
    [editor],
  );

  React.useEffect(() => {
    setSelectedColor(color);
  }, [color]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <ToolbarButton
          tooltip="Text color"
          aria-label="Text color"
          className="w-12"
          size={size}
          variant={variant}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5"
            style={{ color: selectedColor }}
          >
            <path d="M4 20h16" />
            <path d="m6 16 6-12 6 12" />
            <path d="M8 12h8" />
          </svg>
          <CaretDownIcon className="size-5" />
        </ToolbarButton>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-full">
        <div className="space-y-1.5">
          {COLORS.map((palette, index) => (
            <MemoizedColorPicker
              key={index}
              palette={palette}
              inverse={palette.inverse}
              selectedColor={selectedColor}
              onColorChange={handleColorChange}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

SectionThree.displayName = "SectionThree";

export default SectionThree;
