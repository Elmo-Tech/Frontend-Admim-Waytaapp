/** The Guest menu templates a package can allow besides Classic, which is always allowed (DEC-051). */
export const PACKAGE_TEMPLATES = ["LIST", "GALLERY", "MENU", "FLOATING", "CENTERED", "COMPACT", "EDITORIAL", "EMBER", "BLOOM", "BREW"] as const;

export type PackageTemplate = (typeof PACKAGE_TEMPLATES)[number];

/** The tier of each design (DEC-052); Classic is standard and always included. Mirrors the API. */
export const STANDARD_TEMPLATES = ["LIST", "CENTERED", "COMPACT", "EDITORIAL"] as const satisfies readonly PackageTemplate[];

export const PREMIUM_TEMPLATES = ["GALLERY", "MENU", "FLOATING", "EMBER", "BLOOM", "BREW"] as const satisfies readonly PackageTemplate[];
