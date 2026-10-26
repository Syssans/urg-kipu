import UIKit
import Capacitor

/// Root of the app: the web app (Capacitor) fills the screen and the native iOS
/// chrome sits on top of it, as siblings so the bars get their own touches:
/// a navigation bar (title + system back button) and a tab bar.
/// The web side drives them through the NativeChrome plugin (src/lib/native.ts).
class KipuViewController: UIViewController {
    static let accent = UIColor(red: 0xa7 / 255, green: 0x8b / 255, blue: 0xfa / 255, alpha: 1)

    private let web = KipuBridgeViewController()
    private let navBar = UINavigationBar()
    // The system bar is transparent on iOS 26+ (it expects a native scroll view under it),
    // so give it a blurred backdrop that fades out at its lower edge.
    private let navBackdrop = UIVisualEffectView(effect: UIBlurEffect(style: .systemChromeMaterialDark))
    private let navBackdropFade = CAGradientLayer()
    private static let fadeHeight: CGFloat = 14
    private let navItem = UINavigationItem()
    private let tabBar = UITabBar()
    private var chrome: NativeChromePlugin { web.chrome }
    private lazy var backButton: UIBarButtonItem = {
        let item = UIBarButtonItem(
            image: UIImage(systemName: "chevron.backward"),
            style: .plain,
            target: self,
            action: #selector(backTapped)
        )
        item.accessibilityLabel = "Retour"
        return item
    }()

    // Same order, labels and icons as the web BottomNav.
    private let tabs: [(title: String, icon: String)] = [
        ("Accueil", "tab-home"),
        ("Scores", "tab-scores"),
        ("Calcul", "tab-calcul"),
        ("Arbres", "tab-arbres"),
        ("Favoris", "tab-favoris"),
    ]

    override func viewDidLoad() {
        super.viewDidLoad()
        overrideUserInterfaceStyle = .dark
        view.backgroundColor = UIColor(red: 0x0a / 255, green: 0x0a / 255, blue: 0x0b / 255, alpha: 1)

        addChild(web)
        web.view.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(web.view)
        NSLayoutConstraint.activate([
            web.view.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            web.view.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            web.view.topAnchor.constraint(equalTo: view.topAnchor),
            web.view.bottomAnchor.constraint(equalTo: view.bottomAnchor),
        ])
        web.didMove(toParent: self)

        setUpNavBar()
        setUpTabBar()
    }

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        let bounds = navBackdrop.bounds
        navBackdropFade.frame = bounds
        let solidEnd = bounds.height > 0 ? (bounds.height - Self.fadeHeight) / bounds.height : 1
        navBackdropFade.locations = [0, NSNumber(value: Double(solidEnd)), 1]
    }

    override var childForStatusBarStyle: UIViewController? { web }
    override var childForStatusBarHidden: UIViewController? { web }

    private func setUpNavBar() {
        let appearance = UINavigationBarAppearance()
        appearance.configureWithDefaultBackground()
        appearance.titleTextAttributes = [.foregroundColor: UIColor.white]
        navBar.standardAppearance = appearance
        navBar.scrollEdgeAppearance = appearance
        navBar.compactAppearance = appearance
        navBar.tintColor = Self.accent
        navBar.delegate = self
        navBar.items = [navItem]
        navBar.isHidden = true
        navBackdrop.isHidden = true
        navBackdropFade.colors = [UIColor.black.cgColor, UIColor.black.cgColor, UIColor.clear.cgColor]
        navBackdrop.layer.mask = navBackdropFade

        navBackdrop.translatesAutoresizingMaskIntoConstraints = false
        navBar.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(navBackdrop)
        view.addSubview(navBar)
        NSLayoutConstraint.activate([
            navBar.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            navBar.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            navBar.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            navBackdrop.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            navBackdrop.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            navBackdrop.topAnchor.constraint(equalTo: view.topAnchor),
            navBackdrop.bottomAnchor.constraint(equalTo: navBar.bottomAnchor, constant: Self.fadeHeight),
        ])
    }

    private func setUpTabBar() {
        tabBar.items = tabs.enumerated().map { index, tab in
            UITabBarItem(title: tab.title, image: UIImage(named: tab.icon), tag: index)
        }
        let appearance = UITabBarAppearance()
        appearance.configureWithDefaultBackground()
        tabBar.standardAppearance = appearance
        tabBar.scrollEdgeAppearance = appearance
        tabBar.tintColor = Self.accent
        tabBar.delegate = self
        tabBar.selectedItem = tabBar.items?.first

        tabBar.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(tabBar)
        NSLayoutConstraint.activate([
            tabBar.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            tabBar.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            tabBar.bottomAnchor.constraint(equalTo: view.bottomAnchor),
        ])
    }

    /// Space the web page must leave free at the top (status bar + nav bar)
    /// and at the bottom (tab bar + home indicator), in CSS pixels.
    func insets() -> [String: Any] {
        view.layoutIfNeeded()
        let navHeight = navBar.sizeThatFits(view.bounds.size).height
        return [
            "top": view.safeAreaInsets.top + navHeight,
            "bottom": view.bounds.height - tabBar.frame.minY,
        ]
    }

    func setNav(title: String?, back: Bool) -> [String: Any] {
        if let title {
            navItem.title = title
            navItem.leftBarButtonItem = back ? backButton : nil
            navBar.isHidden = false
        } else {
            navBar.isHidden = true
        }
        navBackdrop.isHidden = navBar.isHidden
        return insets()
    }

    func setTab(_ index: Int) -> [String: Any] {
        let items = tabBar.items ?? []
        tabBar.selectedItem = items.indices.contains(index) ? items[index] : nil
        return insets()
    }

    @objc private func backTapped() {
        chrome.emit("back")
    }
}

extension KipuViewController: UINavigationBarDelegate {
    // Lets the bar's background extend up under the status bar.
    func position(for bar: UIBarPositioning) -> UIBarPosition {
        .topAttached
    }
}

extension KipuViewController: UITabBarDelegate {
    func tabBar(_ tabBar: UITabBar, didSelect item: UITabBarItem) {
        chrome.emit("tab", ["index": item.tag])
    }
}

/// The Capacitor web view, with the NativeChrome plugin registered.
class KipuBridgeViewController: CAPBridgeViewController {
    let chrome = NativeChromePlugin()

    override func capacitorDidLoad() {
        bridge?.registerPluginInstance(chrome)
    }
}

@objc(NativeChromePlugin)
class NativeChromePlugin: CAPPlugin, CAPBridgedPlugin {
    let identifier = "NativeChromePlugin"
    let jsName = "NativeChrome"
    let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "setNav", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setTab", returnType: CAPPluginReturnPromise),
    ]

    private var host: KipuViewController? {
        bridge?.viewController?.parent as? KipuViewController
    }

    @objc func setNav(_ call: CAPPluginCall) {
        let title = call.getString("title")
        let back = call.getBool("back") ?? false
        DispatchQueue.main.async {
            guard let host = self.host else { return call.reject("No native chrome") }
            call.resolve(host.setNav(title: title, back: back))
        }
    }

    @objc func setTab(_ call: CAPPluginCall) {
        let index = call.getInt("index") ?? -1
        DispatchQueue.main.async {
            guard let host = self.host else { return call.reject("No native chrome") }
            call.resolve(host.setTab(index))
        }
    }

    func emit(_ event: String, _ data: [String: Any] = [:]) {
        notifyListeners(event, data: data)
    }
}
