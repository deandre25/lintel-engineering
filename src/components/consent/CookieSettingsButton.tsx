'use client';

export interface CookieSettingsButtonProps {
  label: string;
}

/**
 * Reopens the consent banner from the footer (§10: the choice must be
 * revisitable). A button rather than a link, because it changes nothing about
 * the address and navigates nowhere.
 */
export function CookieSettingsButton({ label }: CookieSettingsButtonProps) {
  return (
    <button
      type="button"
      onClick={() => {
        window.dispatchEvent(new Event('lintel:consent-reopen'));
      }}
      className="text-left transition-colors hover:text-inverse"
    >
      {label}
    </button>
  );
}
