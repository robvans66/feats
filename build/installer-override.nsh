!macro customInstall
  ; Recreate shortcuts with explicit icon path to avoid inheriting default Electron icon.
  ${if} ${FileExists} "$INSTDIR\resources\icon.ico"
    ${if} ${FileExists} "$newDesktopLink"
      Delete "$newDesktopLink"
      CreateShortCut "$newDesktopLink" "$appExe" "" "$INSTDIR\resources\icon.ico" 0 "" "" "${APP_DESCRIPTION}"
      WinShell::SetLnkAUMI "$newDesktopLink" "${APP_ID}"
    ${endIf}

    ${if} ${FileExists} "$newStartMenuLink"
      Delete "$newStartMenuLink"
      CreateShortCut "$newStartMenuLink" "$appExe" "" "$INSTDIR\resources\icon.ico" 0 "" "" "${APP_DESCRIPTION}"
      WinShell::SetLnkAUMI "$newStartMenuLink" "${APP_ID}"
    ${endIf}

    System::Call 'Shell32::SHChangeNotify(i 0x8000000, i 0, i 0, i 0)'
  ${endIf}
!macroend
