import { useSelector, useDispatch } from "react-redux";
import { setLanguage } from "../../store/slices/crmSlice";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

const LanguageSelector = () => {
  const dispatch = useDispatch();
  const { language } = useSelector((state) => state.crm);

  const languages = [
    {
      value: "EN",
      label: "English",
      flag: "🇺🇸",
    },
    {
      value: "HI",
      label: "हिंदी",
      flag: "🇮🇳",
    },
  ];

  const activeLanguage = languages.find((l) => l.value === language);

  const handleLanguageChange = (newLanguage) => {
    dispatch(setLanguage(newLanguage));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 px-2">
          {activeLanguage?.flag} {activeLanguage?.value}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.value}
            onClick={() => handleLanguageChange(lang.value)}
            className="flex items-center gap-2"
          >
            <span className="mr-1">{lang.flag}</span>
            <span>{lang.label}</span>
            {lang.value === language && (
              <span className="ml-auto h-1.5 w-1.5 fill-current bg-foreground rounded-full"></span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
