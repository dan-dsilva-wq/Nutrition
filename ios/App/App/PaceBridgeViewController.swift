import UIKit
import Capacitor

/// Capacitor's bridge view controller plus Pace's in-app plugins, which live in the
/// App target rather than an npm package. Main.storyboard points at this class.
class PaceBridgeViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(AppleSignInPlugin())
    }
}
