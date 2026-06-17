const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const newFormHtml = `<form id="heroQuickForm" class="hero-quick-form">
                                <div class="form-group">
                                    <input type="text" id="heroName" name="name" placeholder="Your Full Name" required class="form-input">
                                    <div class="form-input-border"></div>
                                </div>
                                <div class="form-group">
                                    <input type="tel" id="heroPhone" name="phone" placeholder="Contact Number" required class="form-input">
                                    <div class="form-input-border"></div>
                                </div>
                                <div class="form-group">
                                    <input type="text" id="heroService" name="service" placeholder="Service Required" required class="form-input">
                                    <div class="form-input-border"></div>
                                </div>
                                <div class="form-group" style="position: relative;">
                                    <input type="text" id="heroAddress" name="address" placeholder="Address / Share Location" required class="form-input" style="padding-right: 40px;">
                                    <div class="form-input-border"></div>
                                    <button type="button" class="get-location-btn" title="Get Current Location" style="position: absolute; right: 10px; top: 12px; background: none; border: none; cursor: pointer; color: var(--primary-blue); font-size: 1.2rem; z-index: 2;">
                                        <i class="fas fa-map-marker-alt"></i>
                                    </button>
                                </div>
                                <div class="form-group">
                                    <textarea id="heroProblem" name="problem" placeholder="Problem Description" required class="form-input" rows="2" style="resize: vertical; min-height: 60px;"></textarea>
                                    <div class="form-input-border"></div>
                                </div>
                                <button type="submit" class="hero-form-btn">
                                    <i class="fab fa-whatsapp"></i>
                                    Get Help on WhatsApp
                                </button>
                            </form>`;

html = html.replace(/<form id="heroQuickForm" class="hero-quick-form">[\s\S]*?<\/form>/g, newFormHtml);
fs.writeFileSync('index.html', html);
