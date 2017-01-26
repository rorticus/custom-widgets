import './callToActionElement';
import './sideBySideElement';
import './featureListElement';

declare global {
	interface SymbolConstructor {
		observable: symbol;
	}
}